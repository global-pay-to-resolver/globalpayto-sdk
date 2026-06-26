# GlobalPayTo MVP API Contracts

Date: 2026-06-24  
Status: Sprint 1 finalized design  
Repo: `globalpayto-sdk`

## Scope

This document finalizes the MVP public contract for GlobalPayTo integrations. It is a design artifact only; Sprint 2 will turn these shapes into package schemas, TypeScript types, validators, fixtures, and SDK helpers.

The contract intentionally covers only verified-stamp identity, Modality B route registration, one-time GlobalPayTo JSON intents, safe action statuses, and Cubid comms notification event payloads.

## Shared Primitives

### Recipient

```json
{
  "identifierType": "verified_stamp",
  "identifier": "email:noak@example.com"
}
```

Rules:

- `identifierType` is `verified_stamp` for MVP.
- `identifier` is provided by the integrator request and is validated server-side through Cubid.
- Responses must use hashes, masked displays, or Cubid aliases instead of exposing raw identifiers where possible.

### Route Or Path

```json
{
  "chain": "base",
  "network": "mainnet",
  "asset": "USDC"
}
```

Rules:

- Route/path matching uses chain, network, and asset in MVP.
- `network` is required so SDK schemas do not accept ambiguous mainnet/testnet-style requests.
- Route registration must not include account, address, memo, payment link, or chain-specific payment instruction fields.
- Dynamic destination details belong only inside a selected provider intent response.

### Amount

```json
{
  "value": "25.00",
  "currency": "USDC"
}
```

Rules:

- `value` is a decimal string.
- `currency` is the payment currency requested by the PayingDapp and should align with the selected path asset for MVP.

## Public Status Model

Public statuses:

| Status | Meaning | Integrator handling |
| --- | --- | --- |
| `resolved` | A GlobalPayTo intent is ready. | Present or execute the returned payment instruction. |
| `no_route` | No authorized compatible PayToDapp route exists. | Show safe no-route copy; do not infer recipient existence or route details. |
| `user_action_required` | A route-selection step is required. | Send the signed-in user to the route-selection action URL when present. |
| `authorization_required` | The dapp does not have required user authorization. | Show safe authorization-required copy or use a Cubid-owned grant path when available. |
| `unsupported_path` | Requested paths do not match supported MVP route constraints. | Ask for another supported route/path. |
| `provider_unavailable` | Selected PayToDapp could not be reached or is temporarily unavailable. | Retry later or show temporary failure. |
| `provider_error` | Selected PayToDapp returned an invalid or failed response. | Show failure and retry only if user flow allows. |
| `expired_authorization` | Required authorization has expired. | Send user through authorization again. |
| `revoked_authorization` | User or system revoked authorization. | Do not retry without new authorization. |
| `invalid_identifier` | Cubid validation rejected the pay-to identifier. | Ask for a different identifier. |
| `invalid_request` | Request failed schema or policy validation. | Fix integrator request before retrying. |

Private backend diagnostics must never appear as public statuses.

Route-selection action URLs for `user_action_required` are opaque, short-lived,
and safe to open before authentication. The public site authenticates the user
with Cubid before hydrating route details. `no_route` and
`authorization_required` are status-only in the MVP and must not link to
per-request setup or requesting-app approval pages.

## PayToDapp Route Registration

Endpoints:

```http
POST /functions/v1/payto-routes
GET /functions/v1/payto-routes
PATCH /functions/v1/payto-routes/{routeId}
DELETE /functions/v1/payto-routes/{routeId}
```

Route CRUD responses are scoped to the authenticated PayToDapp and the current user/action context. `GET`, `PATCH`, and `DELETE` must never expose unrelated routes, unrelated PayToDapps, user route preferences, wallet graph details, or private diagnostics.

Create/update request:

```json
{
  "recipient": {
    "identifierType": "verified_stamp",
    "identifier": "email:noak@example.com"
  },
  "payToDappId": "smartrust-wallet",
  "supportedRoutes": [
    {
      "chain": "base",
      "network": "mainnet",
      "asset": "USDC"
    }
  ],
  "consentToken": "cubid_consent_token"
}
```

Resolved registration response:

```json
{
  "status": "resolved",
  "routes": [
    {
      "id": "gptr_route_123",
      "payToDappId": "smartrust-wallet",
      "chain": "base",
      "network": "mainnet",
      "asset": "USDC",
      "state": "active"
    }
  ]
}
```

Route selection required response:

```json
{
  "status": "user_action_required",
  "action": {
    "type": "route_selection",
    "url": "https://globalpayto.example/actions/route-selection/gptr_act_123",
    "expiresAt": "2026-06-24T20:00:00Z"
  }
}
```

Rules:

- Requests with account/address/payment-instruction fields are `invalid_request`.
- Overlapping routes can return `user_action_required` until the user confirms priority/default.
- PayingDapps must not receive route preference details.

## PayingDapp Resolve

Endpoint:

```http
POST /functions/v1/resolve
```

Request:

```json
{
  "recipient": {
    "identifierType": "verified_stamp",
    "identifier": "email:noak@example.com"
  },
  "supportedPaths": [
    {
      "chain": "base",
      "network": "mainnet",
      "asset": "USDC"
    }
  ],
  "amount": {
    "value": "25.00",
    "currency": "USDC"
  },
  "purpose": "payout",
  "intentMode": "one_time",
  "payingDappReference": "chaincrew:payout_987"
}
```

No route response:

```json
{
  "status": "no_route"
}
```

`no_route` is status-only in the MVP. The public site does not host
per-request setup or requesting-app approval pages because send-to channels are
pre-authorized for requesting apps by default.

User action response:

```json
{
  "status": "user_action_required",
  "action": {
    "type": "route_selection",
    "url": "https://globalpayto.example/actions/route-selection/gptr_act_789",
    "expiresAt": "2026-06-24T20:00:00Z"
  }
}
```

Resolved response returns the GlobalPayTo intent shape below.

Rules:

- `intentMode` is `one_time` for MVP.
- Resolver responses must not disclose unrelated PayToDapps, route preferences, wallet graphs, or raw private identifiers.
- Action URLs use opaque action ids or tokens and are short-lived hosted-action links.
- Hosted action tokens are one-time or replay-protected and must be exchanged into a clean URL after validation where the site flow supports it.
- Action URLs must not embed recipient, route, provider, authorization, wallet, preference, or diagnostic data.
- Unauthenticated action pages must remain safe even when opened by the wrong user, crawler, browser preview, or expired session.

## Provider Intent Callback

Endpoint:

```http
POST {payToDapp.intentEndpoint}/payment-intents
```

Request:

```json
{
  "resolverRequestId": "gptr_req_123",
  "recipient": {
    "identifierType": "verified_stamp",
    "identifierAlias": "cubid_stamp_alias_abc"
  },
  "payingDappId": "chaincrew",
  "selectedPath": {
    "chain": "base",
    "network": "mainnet",
    "asset": "USDC"
  },
  "amount": {
    "value": "25.00",
    "currency": "USDC"
  },
  "purpose": "payout",
  "expiresAt": "2026-06-24T20:00:00Z"
}
```

Expected provider response:

```json
{
  "providerIntentId": "st_pi_456",
  "status": "ready",
  "paymentInstruction": {
    "type": "provider_json",
    "provider": "smartrust-wallet",
    "payload": {
      "providerIntentId": "st_pi_456",
      "chain": "base",
      "network": "mainnet",
      "asset": "USDC",
      "destination": {
        "kind": "blockchain_address",
        "recipientAddress": "0xabc..."
      },
      "amount": "25.00",
      "reference": "smartrust:st_pi_456",
      "expiresAt": "2026-06-24T20:00:00Z"
    }
  }
}
```

Rules:

- Callback authentication and replay protection are required.
- Public conformance requires signature or equivalent auth metadata, timestamp, nonce, request expiry, and `resolverRequestId`.
- Providers must reject callbacks outside the allowed clock-skew window, repeated nonce/timestamp combinations, and expired requests.
- Repeated callbacks with the same `resolverRequestId` must be handled idempotently.
- Provider response payloads are preserved inside `paymentInstruction.payload`.
- External payment protocol rendering is out of scope for MVP.

## GlobalPayTo Intent

```json
{
  "status": "resolved",
  "intent": {
    "id": "gptr_pi_123",
    "schema": "globalpayto.intent.v1",
    "status": "ready",
    "modality": "provider_intent",
    "recipient": {
      "identifierType": "verified_stamp",
      "identifierHash": "sha256:..."
    },
    "selectedRoute": {
      "payToDappId": "smartrust-wallet",
      "chain": "base",
      "network": "mainnet",
      "asset": "USDC"
    },
    "amount": {
      "value": "25.00",
      "currency": "USDC"
    },
    "expiresAt": "2026-06-24T20:00:00Z",
    "singleUse": true,
    "paymentInstruction": {
      "type": "provider_json",
      "provider": "smartrust-wallet",
      "payload": {
        "providerIntentId": "st_pi_456",
        "chain": "base",
        "network": "mainnet",
        "asset": "USDC",
        "destination": {
          "kind": "blockchain_address",
          "recipientAddress": "0xabc..."
        },
        "amount": "25.00",
        "reference": "smartrust:st_pi_456",
        "expiresAt": "2026-06-24T20:00:00Z"
      }
    },
    "references": {
      "resolverReference": "gptr_pi_123",
      "providerReference": "st_pi_456",
      "payingDappReference": "chaincrew:payout_987"
    }
  }
}
```

Rules:

- `schema` is `globalpayto.intent.v1` for MVP.
- `singleUse` defaults to `true`.
- `paymentInstruction.type` is `provider_json`.
- The resolver validates the envelope and the required provider payload fields below.

Required `provider_json.payload` keys:

- `providerIntentId`
- `chain`
- `network`
- `asset`
- `destination`
- `amount`
- `reference`
- `expiresAt`

Matching rules:

- `chain`, `network`, and `asset` must match the selected route/path.
- `amount` must match `intent.amount.value`.
- `expiresAt` must not exceed the GlobalPayTo intent expiry.
- `destination.kind` is `blockchain_address` in the MVP.
- `destination.recipientAddress` is the provider-selected destination for this intent and must not appear in route registration.
- Top-level `recipientAddress`, `address`, and `account` fields are rejected so integrators do not confuse route registration with provider-selected destinations.
- Providers may add extension fields, but SDK validators must preserve unknown extension fields without allowing them to replace required keys.

## Route Quote Preview

Payor-app route option and intent option flows may return quote previews before a final intent is selected. A quote preview describes one executable candidate without revealing recipient wallet inventory or unrelated PayToDapps.

```json
{
  "id": "gptr_quote_123",
  "method": "cross_chain_intent",
  "methodLabel": "Cross-chain intent route",
  "send": {
    "chain": "eip155",
    "network": "1",
    "asset": "USDC",
    "amount": "25.25"
  },
  "receive": {
    "chain": "eip155",
    "network": "8453",
    "asset": "USDC",
    "amount": "25.00"
  },
  "fees": [
    {
      "label": "Provider cost",
      "amount": "0.20",
      "asset": "USDC",
      "chargedTo": "sender",
      "source": "provider"
    }
  ],
  "expiresAt": "2026-06-24T20:00:00Z",
  "resolverReference": "gptr_req_123"
}
```

Rules:

- `method` is one of `direct_transfer`, `provider_exchange`, `provider_intent`, `bridge`, or `cross_chain_intent`.
- Fee `source` is one of `payor_app`, `provider`, or `resolver`.
- MVP quote fees are charged to the sender.
- Quote previews must not include route preferences, unrelated PayToDapps, wallet addresses, or wallet graph details.

## Cubid Comms Notification Events

Notification delivery uses Cubid comms. GlobalPayTo defines public event payloads so backend, site, and SDK consumers agree on data shape.

Common payload fields:

```json
{
  "eventType": "payment_intent_created",
  "schema": "globalpayto.notification.v1",
  "recipient": {
    "identifierType": "verified_stamp",
    "maskedDisplay": "n***@example.com"
  },
  "amount": {
    "value": "25.00",
    "currency": "USDC"
  },
  "references": {
    "resolverReference": "gptr_pi_123",
    "providerReference": "st_pi_456",
    "payingDappReference": "chaincrew:payout_987"
  },
  "action": {
    "type": "none"
  }
}
```

Initial event types:

- `payment_intent_created`

Future event candidates such as provider-reported receipt events or notification-driven user-action events require separate trust, disclosure, and callback contracts before they become public SDK events.

Rules:

- Notification payloads may include masked display values, public references, amounts, and action URLs when allowed by the event contract.
- Notification payloads must omit wallet graphs, unrelated PayToDapps, route preferences, provider internals, raw identifiers, and private backend diagnostics.
- GlobalPayTo does not define a separate notification provider SDK in MVP.

## Versioning And Compatibility

MVP schema names:

- `globalpayto.intent.v1`
- `globalpayto.notification.v1`

Rules:

- Before the first package release, contract docs are the source of truth.
- Sprint 2 packages must export schemas/types generated from a single source for these shapes.
- Breaking changes require a new schema version once packages are published.
- Additive optional fields may be allowed only when existing consumers can ignore them safely.
- Backend and site work must not rely on undocumented fields.
