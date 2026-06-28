# MyPayTag SDK TODO

This document tracks MVP implementation work for the public developer-facing protocol and SDK repo.

## Sprint 1: SDK And API Design

### GPTS-S1-T1 Finalize Public API Status Model

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: TBD

Define the public resolver status set, status meanings, and integrator-facing handling guidance for `resolved`, `no_route`, `user_action_required`, `authorization_required`, `unsupported_path`, `provider_unavailable`, `provider_error`, `expired_authorization`, `revoked_authorization`, `invalid_identifier`, and `invalid_request`.

Acceptance notes:

- Status names match the PRD and protocol architecture doc.
- Public docs explain which statuses are terminal, retryable, or user-action driven.
- Private backend diagnostics are explicitly out of scope for the public contract.

### GPTS-S1-T2 Finalize Route Registration Contract

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: TBD

Define the PayToDapp route registration request, route CRUD response shapes, validation rules, and `user_action_required` behavior for overlapping routes.

Acceptance notes:

- Contract supports verified-stamp recipients and supported route declarations.
- Contract rejects account, address, and chain-specific payment instruction fields.
- Contract preserves the Modality B boundary where PayToDapps create payment intents later.

### GPTS-S1-T3 Finalize Resolve Request And Response Contract

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: TBD

Define the PayingDapp resolve request and response contracts, including recipient stamp input, supported paths, amount, purpose, intent mode, PayingDapp reference, and safe action URLs.

Acceptance notes:

- Contract supports `resolved`, `no_route`, and `user_action_required` responses.
- Contract avoids exposing route preference data or broader wallet graph information.
- Contract clearly identifies when integrators should redirect users to setup or route selection.
- Safe action URLs use opaque tokens with replay/expiry behavior and response-shape constraints for `no_route`, `authorization_required`, and `user_action_required`.

### GPTS-S1-T4 Finalize Provider Intent Callback Contract

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: TBD

Define the resolver-to-PayToDapp payment intent callback request and expected provider response shape.

Acceptance notes:

- Contract includes resolver request id, recipient alias, paying dapp id, selected path, amount, purpose, and expiry.
- Contract documents authentication and replay-protection requirements without publishing private resolver secrets.
- Contract defines provider-facing verification requirements for signature or equivalent auth metadata, timestamp/nonce handling, expiry skew, and repeated `resolverRequestId` idempotency.
- Contract supports provider JSON payloads without requiring external protocol rendering.

### GPTS-S1-T5 Finalize MyPayTag Intent Schema

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: TBD

Define `mypaytag.intent.v1`, including intent id, status, modality, recipient hash, selected route, amount, expiry, single-use flag, payment instruction, and references.

Acceptance notes:

- Schema validates the MyPayTag envelope and typed `provider_json.payload` fields.
- Required payload keys include chain, network, asset, amount, reference, expiry, and destination semantics.
- Schema keeps provider-specific details inside `paymentInstruction.payload`.
- Schema does not add ERC-681, Solana Pay, WalletConnect Pay, ENS, FIO, Request Network, Stripe, Circle, Coinbase Commerce, or hosted payment link renderers.

### GPTS-S1-T6 Define Contract Versioning And Compatibility Rules

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: TBD

Define how protocol versions, schema names, SDK exports, and breaking changes are managed before the first package release.

Acceptance notes:

- Versioning covers `mypaytag.intent.v1` and request/response schemas.
- Compatibility policy tells integrators what can change before and after MVP release.
- Backend and site consumers can depend on stable package exports once implementation starts.

### GPTS-S1-T7 Finalize Cubid Comms Notification Event Contracts

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-sdk:GPTS-S1-T1, mypaytag-sdk:GPTS-S1-T5

Define public Cubid comms event payload types for the MVP user-visible resolver notification event, `payment_intent_created`.

Acceptance notes:

- Notification event types use masked display values, public references, and action URLs when needed.
- Payloads omit wallet graphs, unrelated PayToDapps, route preferences, provider internals, raw identifiers, and private backend diagnostics.
- Delivery is explicitly through Cubid comms, not a new MyPayTag notification provider SDK.
- Provider-reported receipt and notification-driven user-action events are tracked as future contracts, not MVP notification events.

## Sprint 2: SDK Package Implementation

### GPTS-S2-T1 Implement Protocol Schema Package

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-sdk:GPTS-S1-T1, mypaytag-sdk:GPTS-S1-T2, mypaytag-sdk:GPTS-S1-T3, mypaytag-sdk:GPTS-S1-T4, mypaytag-sdk:GPTS-S1-T5, mypaytag-sdk:GPTS-S1-T6, mypaytag-sdk:GPTS-S1-T7

Implement `@mypaytag/protocol` as the source of truth for public schemas, TypeScript types, enums, error/status codes, and test vectors.

Acceptance notes:

- Types are exported from the same schema source used for validation.
- Package exports support both integrator SDKs and backend imports.
- Fixtures include valid and invalid examples for each MVP request/response family.
- Package includes notification event schemas for Cubid comms payload validation.

### GPTS-S2-T2 Implement PayingDapp SDK Helpers

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S2-T1

Implement `@mypaytag/sdk` helpers for PayingDapp integrations.

Acceptance notes:

- Helpers build resolve requests and validate resolver responses.
- Helpers provide status narrowing for `resolved`, action-required, retryable, and invalid-request paths.
- Helpers provide notification event type guards for Cubid comms payloads.
- Helpers do not hide user-action URLs from integrators.

### GPTS-S2-T3 Implement PayToDapp Provider SDK Helpers

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-sdk:GPTS-S2-T1

Implement `@mypaytag/provider-sdk` helpers for PayToDapp route registration and Modality B intent callbacks.

Acceptance notes:

- Helpers build supported route registration requests.
- Helpers validate provider callback requests and provider intent responses.
- Helpers include interfaces for authentication and replay-protection integration.

### GPTS-S2-T4 Implement Testing Fixtures And Mock Services

Status: Complete  
Feature branch: main  
Session log: agent-context/session-log/main.md  
Depends on: mypaytag-sdk:GPTS-S2-T1

Implement `@mypaytag/testing` fixtures and mocks for protocol conformance and local integration tests.

Acceptance notes:

- Fixtures cover happy path, no route, route selection required, invalid identifier, provider failure, and forbidden address registration.
- Fixtures include the MVP Cubid comms notification event for `payment_intent_created`.
- Provider-reported receipt and notification-driven user-action fixtures are future/negative fixtures only.
- Mock resolver, mock Cubid validator, and mock PayToDapp are clearly separate from production resolver behavior.
- Test vectors are reusable by backend and site acceptance tests.

## Sprint 3: Public Examples And Integration Docs

### GPTS-S3-T1 Build PayingDapp Basic Example

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S2-T2, mypaytag-sdk:GPTS-S2-T4

Build a runnable example showing a PayingDapp resolving a verified-stamp recipient into a MyPayTag JSON intent.

Acceptance notes:

- Example handles `resolved`, `no_route`, `user_action_required`, and provider failure statuses.
- Example uses public SDK helpers instead of hand-rolled request code.
- Example does not rely on private backend internals.

### GPTS-S3-T2 Build PayToDapp Modality B Example

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S2-T3, mypaytag-sdk:GPTS-S2-T4

Build a runnable example showing a PayToDapp registering route support and responding to provider intent callbacks.

Acceptance notes:

- Example submits supported routes without wallet addresses.
- Example returns dynamic payment instructions only inside the provider intent response.
- Example demonstrates callback validation and replay-protection integration points.

### GPTS-S3-T3 Remove Or Reframe Modality A Example Placeholder

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S1-T2

Remove the existing Modality A placeholder or reframe it as an explicitly out-of-scope future candidate.

Acceptance notes:

- Public example layout no longer implies Modality A is part of MVP.
- Any retained placeholder clearly says direct address support is not an MVP path.
- README and docs point implementers toward Modality B examples first.

### GPTS-S3-T4 Write Public Integration Guides

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S3-T1, mypaytag-sdk:GPTS-S3-T2

Write public integration docs for PayingDapps, PayToDapps, status handling, privacy boundaries, and test fixtures.

Acceptance notes:

- Guides explain why PayToDapps submit route availability but not wallet addresses.
- Guides explain how to handle setup and route-selection URLs.
- Guides explain Cubid comms `payment_intent_created` notification handling and the privacy limits on notification payloads.
- Guides reserve provider-reported receipt events for a later status-tracking phase.
- Guides avoid private storage layouts, RLS policies, service-role usage, deployment wiring, private logs, and admin processes.

## Sprint 4: SDK Acceptance And Release Readiness

### GPTS-S4-T1 Add Contract Validation Tests

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S2-T1

Add automated tests proving all public request and response schemas accept valid fixtures and reject invalid fixtures.

Acceptance notes:

- Tests cover forbidden address/account fields in route registration.
- Tests cover each public status response.
- Tests cover Cubid comms notification event payload validation.
- Tests run with the repo's standard test command once package scripts exist.

### GPTS-S4-T2 Add Provider Conformance Tests

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S2-T3, mypaytag-sdk:GPTS-S2-T4

Add conformance tests for PayToDapp provider callback behavior and provider intent responses.

Acceptance notes:

- Tests cover valid callback handling, replay-protection integration expectations, provider error behavior, and malformed provider payloads.
- Tests prove provider payloads stay inside the MyPayTag intent envelope.
- Tests do not require private backend secrets.

### GPTS-S4-T3 Add Package Build And Publish Workflow

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S2-T1, mypaytag-sdk:GPTS-S2-T2, mypaytag-sdk:GPTS-S2-T3, mypaytag-sdk:GPTS-S2-T4

Add package manifests, build scripts, test scripts, and publishing workflow scaffolding for the public SDK packages.

Acceptance notes:

- Build verifies protocol, SDK, provider SDK, and testing packages.
- Publishing workflow is safe to run only when release credentials are configured.
- README documents local build and test commands.

### GPTS-S4-T4 Confirm Public Docs Do Not Expose Private Backend Internals

Status: Complete
Feature branch: main
Session log: agent-context/session-log/main.md
Depends on: mypaytag-sdk:GPTS-S3-T4

Review public SDK docs, examples, and README files for private backend leakage.

Acceptance notes:

- Public docs do not link into private repo files.
- Public docs do not describe private storage layouts, service-role handling, deployment wiring, private audit internals, or admin tools.
- Cross-repo references point only to public site docs or stable dependency IDs.

## Sprint 5: Generic Payor-App Route Options And Execution Quotes

### GPTS-S5-T1 Define Route Quote Preview And Payor-App Request Contracts

Status: Complete
Feature branch: feature/mypaytag-resolver-migration
Session log: agent-context/session-log/main.md#2026-06-26-gpts-s5-t1
Depends on: mypaytag-sdk:GPTS-S4-T4

Define public SDK/protocol support for generic payor-app route option and quote preview flows.

Acceptance notes:

- Protocol docs distinguish route availability queries, payment intent option queries, and final resolved intents.
- Quote preview contract covers method, send amount, receive amount, fee rows, expiry, and resolver reference.
- Fee rows can distinguish payor-app, provider, and resolver fee sources.
- Contracts do not expose recipient wallet inventory, route preferences, or unrelated PayToDapps.

### GPTS-S5-T2 Implement Execution Solver Quote Provider Interfaces

Status: Complete
Feature branch: feature/mypaytag-resolver-migration
Session log: agent-context/session-log/main.md#2026-06-26-gpts-s5-t2
Depends on: mypaytag-sdk:GPTS-S5-T1

Implement SDK interfaces and helpers for crypto-native execution solver quote providers.

Acceptance notes:

- SDK exports solver ids for NEAR Intents / 1Click, LI.FI, Squid, 0x Cross-Chain API, Across, and LayerZero Value Transfer API / Stargate.
- SDK exposes a quote provider interface that accepts resolved receive requirements and returns quotes or transaction-request options.
- If a preferred solver is selected, SDK requests that solver only.
- If no preferred solver is selected, SDK requests quotes from every configured provider and returns successful quote results.

### GPTS-S5-T3 Add Generic Payor-App Request Builders

Status: Complete
Feature branch: feature/mypaytag-resolver-migration
Session log: agent-context/session-log/main.md#2026-06-26-gpts-s5-t3
Depends on: mypaytag-sdk:GPTS-S5-T1

Add helper functions that let payor-apps build resolver requests from sender-side app state without hand-rolling protocol payloads.

Acceptance notes:

- Helpers build supported paths, amount values, exactness-aware request inputs, and payor-app references.
- Helpers validate generated payloads against protocol schemas.
- Helpers do not require payor-apps to model recipient PayToDapp preferences or wallet graph state.
- Existing PayingDapp helpers remain backwards-compatible.

### GPTS-S5-T4 Add Generic Quote And Resolver Fixtures

Status: Complete
Feature branch: feature/mypaytag-resolver-migration
Session log: agent-context/session-log/main.md#2026-06-26-gpts-s5-t4
Depends on: mypaytag-sdk:GPTS-S5-T1, mypaytag-sdk:GPTS-S5-T2

Extend `@mypaytag/testing` with generic route option, quote, and solver fixtures.

Acceptance notes:

- Fixtures cover direct transfer, same-chain exchange, bridge, cross-chain intent, no-route, route-selection-required, provider-unavailable, insufficient-balance, exact-send, and exact-receive scenarios.
- Fixtures include SmarTrust-like examples without SmarTrust-specific exported type names.
- Mock quote providers support preferred-solver and quote-fanout tests.
- Fixtures remain public-safe and do not reference private backend implementation details.
