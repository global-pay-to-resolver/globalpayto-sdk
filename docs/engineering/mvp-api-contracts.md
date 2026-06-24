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
  "asset": "USDC"
}
```

Rules:

- Route/path matching uses chain and asset in MVP.
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
| `no_route` | No authorized compatible PayToDapp route exists. | Send user to the setup URL when present. |
| `user_action_required` | A user selection or authorization step is required. | Send user to the action URL when present. |
| `authorization_required` | The dapp does not have required user authorization. | Start or retry authorization. |
| `unsupported_path` | Requested paths do not match supported MVP route constraints. | Ask for another supported route/path. |
| `provider_unavailable` | Selected PayToDapp could not be reached or is temporarily unavailable. | Retry later or show temporary failure. |
| `provider_error` | Selected PayToDapp returned an invalid or failed response. | Show failure and retry only if user flow allows. |
| `expired_authorization` | Required authorization has expired. | Send user through authorization again. |
| `revoked_authorization` | User or system revoked authorization. | Do not retry without new authorization. |
| `invalid_identifier` | Cubid validation rejected the pay-to identifier. | Ask for a different identifier. |
| `invalid_request` | Request failed schema or policy validation. | Fix integrator request before retrying. |

Private backend diagnostics must never appear as public statuses.

## PayToDapp Route Registration

Endpoints:

```http
POST /functions/v1/payto-routes
GET /functions/v1/payto-routes
PATCH /functions/v1/payto-routes/{routeId}
DELETE /functions/v1/payto-routes/{routeId}
```

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
  "status": "no_route",
  "action": {
    "type": "setup",
    "url": "https://globalpayto.example/actions/setup/gptr_act_456",
    "expiresAt": "2026-06-24T20:00:00Z"
  }
}
```

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
- Action URLs are short-lived hosted-action links.

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
      "asset": "USDC",
      "to": "0xabc...",
      "amount": "25.00",
      "reference": "smartrust:st_pi_456",
      "expiresAt": "2026-06-24T20:00:00Z"
    }
  }
}
```

Rules:

- Callback authentication and replay protection are required.
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
        "asset": "USDC",
        "to": "0xabc...",
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
- The resolver validates the envelope and minimum provider payload fields only.

## Cubid Comms Notification Events

Notification delivery uses Cubid comms. GlobalPayTo defines public event payloads so backend, site, and SDK consumers agree on data shape.

Common payload fields:

```json
{
  "eventType": "payment_received",
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
- `payment_received`
- `user_action_required`

Rules:

- Notification payloads may include masked display values, public references, amounts, and action URLs when user action is needed.
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
