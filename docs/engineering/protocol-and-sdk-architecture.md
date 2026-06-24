# GlobalPayTo Protocol And SDK Architecture

Date: 2026-06-24  
Status: MVP architecture  
Repo: `globalpayto-sdk`

## Scope

This public repo owns the developer-facing GlobalPayTo contract. It should become the source of truth for request and response schemas, TypeScript types, SDK helpers, provider integration helpers, examples, mocks, and test vectors.

This repo must not contain private resolver implementation details, production database access, private deployment assumptions, provider secrets, audit internals, or admin tooling.

For hosted user-action UX, see the public site architecture doc in [`../../../globalpayto-site/docs/engineering/hosted-user-actions-architecture.md`](../../../globalpayto-site/docs/engineering/hosted-user-actions-architecture.md) when working from the parent workspace checkout.

## Package Responsibilities

Planned packages:

- `@globalpayto/protocol`: schemas, TypeScript types, enums, OpenAPI source, error/status codes, and test vectors.
- `@globalpayto/sdk`: client helpers for PayingDapp and resolver integrations.
- `@globalpayto/provider-sdk`: helpers for PayToDapp route registration and Modality B intent callbacks.
- `@globalpayto/testing`: mock resolver, mock Cubid validator, mock PayToDapp, fixtures, and conformance test vectors.

The public protocol package should be importable by both integrators and the private resolver backend.

## MVP Protocol Boundary

The MVP protocol supports:

- verified Cubid stamps as pay-to identifiers,
- PayToDapp route registration using supported routes only,
- PayingDapp resolution requests,
- resolver-to-PayToDapp Modality B payment-intent callback schemas,
- GlobalPayTo JSON intent responses,
- safe action/status responses.

The MVP protocol does not support:

- wallet graph lookup,
- direct address/account registration,
- resolver-built Modality A intents,
- swaps, bridges, streams, recurring payments, refunds, or settlement guarantees,
- ERC-681, Solana Pay, WalletConnect Pay, ENS, FIO, Request Network, Stripe, Circle, Coinbase Commerce, or hosted payment link rendering,
- public profile or directory APIs.

## Public API Shapes

### PayToDapp Route Registration

```http
POST /functions/v1/payto-routes
GET /functions/v1/payto-routes
PATCH /functions/v1/payto-routes/{routeId}
DELETE /functions/v1/payto-routes/{routeId}
```

Route registration request:

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

The schema must reject account, address, and chain-specific payment instruction fields. Dynamic addresses belong only in a provider intent response.

### PayingDapp Resolve

```http
POST /functions/v1/resolve
```

Resolve request:

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

### Resolver-To-PayToDapp Intent Callback

```http
POST {payToDapp.intentEndpoint}/payment-intents
```

Callback request:

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

The callback contract must document authentication and replay-protection requirements without publishing resolver secrets.

## GlobalPayTo JSON Intent

Resolved response shape:

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

The protocol validates the GlobalPayTo envelope and minimal provider payload fields. It does not render external protocol formats in the MVP.

## Status Values

Public statuses:

- `resolved`
- `no_route`
- `user_action_required`
- `authorization_required`
- `unsupported_path`
- `provider_unavailable`
- `provider_error`
- `expired_authorization`
- `revoked_authorization`
- `invalid_identifier`
- `invalid_request`

SDK helpers should make it easy for integrators to branch on these statuses without relying on private backend diagnostics.

## SDK Helpers

`@globalpayto/sdk` should provide:

- request builders for PayingDapp resolution,
- schema validation for responses,
- status narrowing helpers,
- retry guidance for provider or resolver availability failures,
- typed handling for `user_action_required` and `no_route` setup URLs.

`@globalpayto/provider-sdk` should provide:

- route registration request builders,
- provider intent callback validation,
- replay-protection helper interfaces,
- conformance tests for provider intent responses.

`@globalpayto/testing` should provide:

- mock resolver responses for each public status,
- mock PayToDapp callback fixtures,
- invalid route registration fixtures that include forbidden address/account fields,
- happy-path verified-stamp fixtures,
- route-overlap fixtures that require user selection.

## Documentation Requirements

Public docs should explain:

- the Modality B route registration model,
- why PayToDapps submit route availability but not wallet addresses,
- how PayingDapps request payment intents,
- how PayToDapps implement payment-intent callbacks,
- how `no_route` and `user_action_required` should be handled,
- privacy boundaries and anti-enumeration behavior at the contract level.

Public docs should not describe private storage layouts, RLS policy details, service-role usage, deployment wiring, private logs, or private admin processes.

## Acceptance Targets

The SDK architecture is MVP-complete when:

- schemas exist for route registration, resolve requests, callback requests, intents, and statuses,
- TypeScript types are generated or exported from the same schema source,
- examples cover PayingDapp resolution and PayToDapp Modality B registration,
- testing fixtures cover happy path, no route, route selection required, invalid identifier, provider failure, and forbidden address registration,
- docs explain public integration behavior without exposing private backend internals.
