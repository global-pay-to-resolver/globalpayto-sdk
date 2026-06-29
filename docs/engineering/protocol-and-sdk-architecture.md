# MyPayTag Protocol And SDK Architecture

Date: 2026-06-24  
Status: MVP architecture  
Repo: `mypaytag-sdk`

## Scope

This public repo owns the developer-facing MyPayTag contract. It should become the source of truth for request and response schemas, TypeScript types, SDK helpers, provider integration helpers, examples, mocks, and test vectors.

This repo must not contain private resolver implementation details, production database access, private deployment assumptions, provider secrets, audit internals, or admin tooling.

For hosted user-action UX, see the public MyPayTag site repository docs, especially `docs/engineering/hosted-user-actions-architecture.md` and `docs/engineering/hosted-action-contract.md`.

## Package Responsibilities

Planned packages:

- `@mypaytag/protocol`: schemas, TypeScript types, enums, OpenAPI source, error/status codes, and test vectors.
- `@mypaytag/sdk`: client helpers for PayingDapp and resolver integrations.
- `@mypaytag/provider-sdk`: helpers for PayToDapp route registration and Modality B intent callbacks.
- `@mypaytag/testing`: mock resolver, mock paytag validator, mock PayToDapp, fixtures, and conformance test vectors.
- Notification-related public event types belong in `@mypaytag/protocol`; delivery uses Cubid comms rather than a MyPayTag notification provider SDK.

The public protocol package should be importable by both integrators and the private resolver backend.

## MVP Protocol Boundary

The MVP protocol supports:

- paytags as MyPayTag payment identifiers backed by external identity and consent providers,
- PayToDapp route registration using supported routes only,
- PayingDapp resolution requests,
- resolver-to-PayToDapp Modality B payment-intent callback schemas,
- MyPayTag JSON intent responses,
- public notification event types for Cubid comms payloads,
- safe action/status responses.

The MVP protocol does not support:

- wallet graph lookup,
- direct address/account registration,
- resolver-built Modality A intents,
- generic swaps, generic bridges, streams, recurring payments, refunds, or settlement guarantees outside the dedicated MVP NEAR 1Click contract,
- ERC-681, Solana Pay, WalletConnect Pay, ENS, FIO, Request Network, Stripe, Circle, Coinbase Commerce, or hosted payment link rendering,
- public profile or directory APIs,
- notification inbox APIs, marketing notification APIs, or non-Cubid notification provider APIs.

## MVP NEAR 1Click Execution

NEAR Intents / 1Click is the Phase 1/MVP execution adapter for SmarTrust swap/bridge Paytag payments. It consumes a resolved receive requirement and returns a NEAR 1Click quote option scoped to the selected PayToDapp route. It does not decide which PayToDapp the recipient prefers.

The MVP SDK surface for this path is the dedicated `NearOneClickMvpQuoteOption`, `NearOneClickMvpQuoteSelectionRequest`, and `NearOneClickMvpPayableInstruction` contract family. MVP PayingDapps should not use generic quote fanout to obtain NEAR 1Click payable instructions.

## Future Extension: Crypto-Native Execution Solvers

LI.FI, Squid, 0x, Across, LayerZero/Stargate, broad solver fanout, and generic external adapter support are Phase 2 extensions. They remain useful architecture context, but they are not required for the MVP resolve path.

Short list for Phase 2 SDK adapter support:

| Solver/router | Best fit |
| --- | --- |
| LI.FI | EVM and Solana cross-chain routing, wallet-controlled execution, bridge/DEX aggregation, and quote responses with wallet-ready transaction requests. |
| Squid | Broad chain coverage, cross-chain swaps, bridges, contract calls, and Cosmos/Axelar-style routing. |
| 0x Cross-Chain API | Cross-chain payments, EVM/Solana routing, stablecoin settlement, fast quote responses, fallback paths, and progress tracking. |
| Across | Fast bridge-focused EVM/L2 stablecoin transfers where supported. |
| LayerZero Value Transfer API / Stargate | Cross-chain token transfer for OFT, LayerZero ecosystem assets, and routes where Stargate coverage is strong. |

`@mypaytag/sdk` exposes a provider interface for these quote sources as non-MVP extension helpers. When a payor-app passes a preferred solver id, the SDK asks only that quote provider. When no preferred solver id is selected, the SDK fans out quote requests to every configured quote provider and returns the successful quotes for app-side display or future extension selection.

## Future Extension: Route Query And Quote Contracts

Generic payor-app extension flows can distinguish three stages:

- route availability query: the app asks what safe receive options can be considered for a paytag and sender-supported path set;
- payment intent option query: the app includes amount and exactness context so MyPayTag or a future extension can return executable or selectable quote previews;
- final resolved intent: the app receives one `mypaytag.intent.v1` instruction for execution or handoff.

Route quote previews are public future-extension contract objects with method, send amount, receive amount, fee rows, expiry, and resolver reference. Fee rows identify whether the source is the payor app, provider, or resolver, and all modeled fees are charged to the sender. Quote previews must not include recipient wallet inventory, route preferences, unrelated PayToDapps, or wallet graph details.

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
    "identifierType": "paytag",
    "identifier": "abd123@cubid.mypaytag"
  },
  "payToDappId": "smartrust-wallet",
  "supportedRoutes": [
    {
      "chain": "base",
      "network": "mainnet",
      "asset": "USDC"
    }
  ],
  "authorizationToken": "mpt_auth_123"
}
```

The schema must reject account, address, and chain-specific payment instruction fields. Dynamic addresses belong only in a provider intent response.

Route CRUD responses expose only PayToDapp-owned scoped route capability data.
List/read/update responses use `status: resolved` envelopes, deletion uses
`status: revoked`, and safe unavailable cases use public status-only shapes such
as `no_route` or `provider_unavailable`. They must not expose route
preferences, unrelated PayToDapps, wallet graphs, raw identifiers, or payment
instructions.

Hosted route-selection action contracts expose only action-scoped route options
after validation and user context checks. Decisions can select an option, leave
the choice unchanged, or deny the action. Completion states include expired,
invalid, replayed, and restart-required outcomes without private diagnostics.

### Paytag Availability Boundary

Paytag availability and issuance are intentionally not public integrator API
contracts in the MVP SDK. They belong to the private MyPayTag/Cubid service
boundary: Cubid owns identity evidence and consent, while MyPayTag owns paytag
uniqueness and availability policy.

The public SDK keeps public-safe availability fixtures only. No availability
boundary should expose wallet addresses, payment route data, route preferences,
wallet graphs, provider payloads, or payment instructions to Cubid.

### PayingDapp Resolve

```http
POST /functions/v1/resolve
```

Resolve request:

```json
{
  "recipient": {
    "identifierType": "paytag",
    "identifier": "abd123@cubid.mypaytag"
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
  "resolverRequestId": "mpt_req_123",
  "recipient": {
    "identifierType": "paytag",
    "paytagReference": "paytag_ref_abc"
  },
  "payingDappId": "chaincrew",
  "payingDappReference": "chaincrew:payout_987",
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

## MyPayTag JSON Intent

Resolved response shape:

```json
{
  "status": "resolved",
  "intent": {
    "id": "mpt_pi_123",
    "schema": "mypaytag.intent.v1",
    "status": "ready",
    "modality": "provider_intent",
    "recipient": {
      "identifierType": "paytag",
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
        "resolverReference": "mpt_req_123",
        "payingDappId": "chaincrew",
        "payingDappReference": "chaincrew:payout_987",
        "chain": "base",
        "network": "mainnet",
        "asset": "USDC",
        "destination": {
          "kind": "blockchain_address",
          "recipientAddress": "0xabc..."
        },
        "amount": "25.00",
        "purpose": "payout",
        "reference": "smartrust:st_pi_456",
        "expiresAt": "2026-06-24T20:00:00Z"
      }
    },
    "references": {
      "resolverReference": "mpt_pi_123",
      "providerReference": "st_pi_456",
      "payingDappReference": "chaincrew:payout_987"
    }
  }
}
```

The protocol validates the MyPayTag envelope and the required `provider_json.payload` keys defined in `mvp-api-contracts.md`, including `providerIntentId`, `resolverReference`, `payingDappId`, `payingDappReference`, `chain`, `network`, `asset`, `destination`, `amount`, `purpose`, `reference`, and `expiresAt`. MVP provider destinations use `destination.kind = "blockchain_address"` with a nested `recipientAddress`; top-level address fields are rejected. The protocol does not render external protocol formats in the MVP.

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

`@mypaytag/sdk` should provide:

- request builders for PayingDapp resolution,
- non-MVP quote helpers for crypto-native execution solver extensions,
- schema validation for responses,
- status narrowing helpers,
- notification event type guards for Cubid comms payloads,
- retry guidance for provider or resolver availability failures,
- typed handling for `user_action_required` route-selection URLs and status-only
  `no_route` / `authorization_required` outcomes.

`@mypaytag/provider-sdk` should provide:

- route registration request builders,
- provider intent callback validation,
- replay-protection helper interfaces,
- conformance tests for provider intent responses.

`@mypaytag/testing` should provide:

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
