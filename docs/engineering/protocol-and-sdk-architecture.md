# GlobalPayTo Protocol And SDK Architecture

Date: 2026-06-24  
Status: MVP architecture  
Repo: `globalpayto-sdk`

## Scope

This public repo owns the developer-facing GlobalPayTo contract. It should become the source of truth for request and response schemas, TypeScript types, SDK helpers, provider integration helpers, examples, mocks, and test vectors.

This repo must not contain private resolver implementation details, production database access, private deployment assumptions, provider secrets, audit internals, or admin tooling.

For hosted user-action UX, see the public GlobalPayTo site repository docs, especially `docs/engineering/hosted-user-actions-architecture.md` and `docs/engineering/hosted-action-contract.md`.

## Package Responsibilities

Planned packages:

- `@globalpayto/protocol`: schemas, TypeScript types, enums, OpenAPI source, error/status codes, and test vectors.
- `@globalpayto/sdk`: client helpers for PayingDapp and resolver integrations.
- `@globalpayto/provider-sdk`: helpers for PayToDapp route registration and Modality B intent callbacks.
- `@globalpayto/testing`: mock resolver, mock Cubid validator, mock PayToDapp, fixtures, and conformance test vectors.
- Notification-related public event types belong in `@globalpayto/protocol`; delivery uses Cubid comms rather than a GlobalPayTo notification provider SDK.

The public protocol package should be importable by both integrators and the private resolver backend.

## MVP Protocol Boundary

The MVP protocol supports:

- verified Cubid stamps as pay-to identifiers,
- PayToDapp route registration using supported routes only,
- PayingDapp resolution requests,
- resolver-to-PayToDapp Modality B payment-intent callback schemas,
- GlobalPayTo JSON intent responses,
- public notification event types for Cubid comms payloads,
- safe action/status responses.

The MVP protocol does not support:

- wallet graph lookup,
- direct address/account registration,
- resolver-built Modality A intents,
- swaps, bridges, streams, recurring payments, refunds, or settlement guarantees,
- ERC-681, Solana Pay, WalletConnect Pay, ENS, FIO, Request Network, Stripe, Circle, Coinbase Commerce, or hosted payment link rendering,
- public profile or directory APIs,
- notification inbox APIs, marketing notification APIs, or non-Cubid notification provider APIs.

## Crypto-Native Execution Solvers

Future payor-app helpers should support crypto-native execution adapters alongside the selected PayToDapp intent flow. These adapters consume a resolved receive requirement and produce quotes or transaction requests; they do not decide which PayToDapp the recipient prefers.

Short list for SDK adapter support:

| Solver/router | Best fit |
| --- | --- |
| NEAR Intents / 1Click | Crypto-to-crypto cross-chain swaps, stablecoin delivery, distribution-channel fees, and default solver-style execution. |
| LI.FI | EVM and Solana cross-chain routing, wallet-controlled execution, bridge/DEX aggregation, and quote responses with wallet-ready transaction requests. |
| Squid | Broad chain coverage, cross-chain swaps, bridges, contract calls, and Cosmos/Axelar-style routing. |
| 0x Cross-Chain API | Cross-chain payments, EVM/Solana routing, stablecoin settlement, fast quote responses, fallback paths, and progress tracking. |
| Across | Fast bridge-focused EVM/L2 stablecoin transfers where supported. |
| LayerZero Value Transfer API / Stargate | Cross-chain token transfer for OFT, LayerZero ecosystem assets, and routes where Stargate coverage is strong. |

`@globalpayto/sdk` should expose a provider interface for these quote sources. When a payor-app passes a preferred solver id, the SDK asks only that quote provider. When no preferred solver id is selected, the SDK fans out quote requests to every configured quote provider and returns the successful quotes for app-side display or resolver-side selection.

## Public API Shapes

The Sprint 1 finalized wire contracts live in [`mvp-api-contracts.md`](./mvp-api-contracts.md). This section summarizes the same public surface.

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
      "network": "mainnet",
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

The callback contract must document authentication and replay-protection requirements without publishing resolver secrets.

Provider SDK helpers must expose concrete verification interfaces for signed requests or equivalent auth metadata, nonce/timestamp checks, expiry skew, and repeated `resolverRequestId` idempotency so conformance tests can prove callbacks are accepted or rejected consistently.

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

The protocol validates the GlobalPayTo envelope and the required `provider_json.payload` keys defined in `mvp-api-contracts.md`, including `providerIntentId`, `chain`, `network`, `asset`, `destination`, `amount`, `reference`, and `expiresAt`. MVP provider destinations use `destination.kind = "blockchain_address"` with a nested `recipientAddress`; top-level address fields are rejected. The protocol does not render external protocol formats in the MVP.

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

## Notification Event Types

The MVP public protocol should define Cubid comms event payload types for user-visible resolver events. MVP event types are:

- `payment_intent_created`

Future event candidates such as provider-reported receipt events or notification-driven user-action events require separate trust, disclosure, and callback contracts.

Notification payloads must use masked display values, public references, and action URLs when needed. They must not include wallet graphs, unrelated PayToDapps, route preferences, provider internals, raw identifiers, or private backend diagnostics.

## SDK Helpers

`@globalpayto/sdk` should provide:

- request builders for PayingDapp resolution,
- quote helpers for crypto-native execution solvers,
- schema validation for responses,
- status narrowing helpers,
- notification event type guards for Cubid comms payloads,
- retry guidance for provider or resolver availability failures,
- typed handling for `user_action_required` route-selection URLs and status-only
  `no_route` / `authorization_required` outcomes.

`@globalpayto/provider-sdk` should provide:

- route registration request builders,
- provider intent callback validation,
- replay-protection helper interfaces,
- conformance tests for provider intent responses.

`@globalpayto/testing` should provide:

- mock resolver responses for each public status,
- mock Cubid comms notification events,
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
- how Cubid comms `payment_intent_created` notifications are shaped and what data they intentionally omit,
- what future documentation is required before provider-reported receipt events are introduced,
- privacy boundaries and anti-enumeration behavior at the contract level.

Public docs should not describe private storage layouts, RLS policy details, service-role usage, deployment wiring, private logs, or private admin processes.

## Acceptance Targets

The SDK architecture is MVP-complete when:

- schemas exist for route registration, resolve requests, callback requests, intents, statuses, and public Cubid comms notification event payloads,
- TypeScript types are generated or exported from the same schema source,
- examples cover PayingDapp resolution and PayToDapp Modality B registration,
- testing fixtures cover happy path, no route, route selection required, invalid identifier, provider failure, and forbidden address registration,
- docs explain public integration behavior without exposing private backend internals.
