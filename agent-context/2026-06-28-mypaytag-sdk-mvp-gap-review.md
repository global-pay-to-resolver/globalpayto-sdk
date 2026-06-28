# MyPayTag SDK MVP Gap Review

Date: 2026-06-28
Repo: `mypaytag-sdk`
Branch reviewed: `codex/mypaytag-mvp-realignment-20260628`
Status: implementation gap note

## Scope

This note evaluates the SDK implementation against:

- `agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- the updated MyPayTag backend PRD scope that promotes NEAR Intents / 1Click into Phase 1/MVP
- the MyPayTag happy-path use cases for paytag issuance, route CRUD, resolve, NEAR 1Click quotes, quote selection, and SmarTrust swap/bridge

The branch is mechanically healthy and `pnpm validate` passes, but several public contract gaps remain against the revised MVP scope.

## Summary

The SDK now correctly moves most public contract language from GlobalPayTo to MyPayTag, uses `paytag` terminology, keeps Cubid internals out of public request shapes, validates the canonical MyPayTag intent envelope, and rejects wallet/address fields during route registration.

However, the SDK still treats all execution quoting as a future generic solver extension. That is no longer aligned with the MVP: NEAR Intents / 1Click is now the only Phase 1 swap/bridge execution adapter, while LI.FI, Squid, 0x, Across, LayerZero/Stargate, broad solver fanout, and generic external adapter support are Phase 2.

## Current Strengths

- `ResolveRequest` and `ResolveResponse` use `identifierType: "paytag"` and keep Cubid internals out of public response shapes.
- `MyPayTagIntent` requires `schema`, `status`, `modality`, `recipient`, `selectedRoute`, `amount`, `expiresAt`, `singleUse`, `paymentInstruction`, and `references`.
- `provider_json.payload` requires provider intent id, chain, network, asset, destination, amount, reference, and expiry.
- Route registration schemas reject top-level account/address/payment-instruction fields.
- Provider SDK helpers validate provider callback and provider response payloads.
- Testing fixtures include opaque paytags, explicit raw paytag examples, safe negative responses, and provider fixtures.
- `pnpm validate` passes on the reviewed branch.

## Gaps Against MVP Scope

### 1. NEAR Intents / 1Click Is Not An MVP Contract

The SDK still labels all crypto-native execution helpers as future extension helpers and includes generic solver ids plus fanout behavior. The revised MVP requires a concrete NEAR Intents / 1Click contract for SmarTrust swap/bridge use cases.

Required change:

- Add explicit Phase 1 NEAR Intents / 1Click quote and selected-payable-instruction contracts.
- Keep LI.FI, Squid, 0x, Across, LayerZero/Stargate, broad fanout, and generic external adapter support as Phase 2 only.
- Update SDK helpers and tests so the MVP path does not rely on generic quote fanout.

### 2. Quote Selection And Payable Instruction Handoff Are Missing

The happy path needs:

1. PayingDapp resolves a paytag and receives one or more NEAR 1Click quotes.
2. PayingDapp selects a quote.
3. MyPayTag validates the selected quote and returns a payable instruction.

Current schemas expose `RouteQuotePreview` and generic `ExecutionQuote`, but they do not define the public request/response shapes for quote option return, quote selection, or selected payable instruction.

Required change:

- Add schemas/types for NEAR 1Click quote options returned by MyPayTag.
- Add schemas/types for selected quote confirmation.
- Add schemas/types for the payable instruction returned after quote selection.
- Add fixtures and validators for quote expiry, route reference, resolver reference, selected PayToDapp route reference, and payable instruction consistency.

### 3. Provider Callback Binding Is Incomplete

The protocol schema requires resolver request id, recipient, PayingDapp id, selected path, amount, purpose, and expiry. The revised MVP also requires PayingDapp reference binding. OpenAPI is currently weaker than the JSON Schema and omits purpose and expiry in the provider callback component.

Required change:

- Add `payingDappReference` to `ProviderCallbackRequest`.
- Align OpenAPI `ProviderCallbackRequest` with JSON Schema and generated TypeScript.
- Ensure provider SDK conformance tests verify purpose, expiry, resolver request id, selected route, amount, PayingDapp id, and PayingDapp reference matching.

### 4. OpenAPI And JSON Schemas Drift

OpenAPI differs from the JSON Schemas for `NotificationEvent` and provider callbacks. This creates integration risk because OpenAPI consumers and TypeScript consumers will build against different payloads.

Required change:

- Make OpenAPI consume or mirror the canonical JSON Schema shapes.
- Align `NotificationEvent` around `eventType`, `schema`, `recipient`, `amount`, `references`, and `action`.
- Add tests that compare OpenAPI examples/components against protocol fixtures, not only string snippets.

### 5. Route CRUD And Hosted Action Contracts Are Incomplete In Protocol Package

OpenAPI documents route CRUD and hosted action endpoints, but the protocol package only exports route registration request/response validators. There are no canonical protocol schemas for PayToRoute reads, route update requests, delete/revoke responses, hosted action view models, hosted action decisions, or hosted action completion.

Required change:

- Add protocol schemas, generated types, validators, and fixtures for route CRUD and hosted route-selection actions.
- Ensure route CRUD types expose only PayToDapp-owned scoped data.
- Ensure hosted action types do not expose route graph, raw identifiers, wallet addresses, unrelated PayToDapps, route preferences, or private diagnostics.

### 6. Paytag Availability Is Fixture-Only

Happy path paytag issuance needs Cubid to check availability with MyPayTag before issuing an opaque paytag. The SDK currently has testing fixtures for availability, but no public or service-facing contract.

Required change:

- Add paytag availability request/response schemas for the MyPayTag/Cubid boundary if this contract belongs in the public SDK.
- If the contract is private service-to-service only, document that explicitly and keep only fixtures/test vectors here.
- Add availability states for available, unavailable, reserved, idempotent retry, raw-explicit, and opaque-default issuance cases.

## Required Change Order

1. Add explicit NEAR Intents / 1Click MVP quote and selected-instruction contracts.
2. Move generic solver fanout docs/tests to Phase 2 language.
3. Fix provider callback binding and OpenAPI/schema drift.
4. Add protocol schemas and validators for route CRUD and hosted action surfaces.
5. Decide and document whether paytag availability is public SDK or private service contract; add schemas if public.
6. Expand fixtures, examples, and conformance tests around the revised MVP happy paths.
7. Run `pnpm validate` after generated artifacts are refreshed through repo scripts.

## Validation Target

The SDK is MVP-ready when:

- `pnpm validate` passes.
- OpenAPI, JSON Schemas, generated TypeScript, fixtures, SDK helpers, provider SDK helpers, and Postman examples agree.
- PayingDapp examples can build same-chain resolve requests and NEAR 1Click swap/bridge quote flows without direct Cubid probing.
- PayToDapp examples can register routes and handle provider callbacks with complete binding fields.
- Testing fixtures cover the MVP happy paths: paytag availability, route registration, route deregistration, resolve, route selection, NEAR 1Click quote options, selected quote payable instruction, and safe negative statuses.
