# Main Session Log

agent: Codex
branch: main
head: b6b5f14
summary: Added and README-linked a public protocol and SDK architecture doc covering schemas, statuses, SDK helpers, provider helpers, examples, fixtures, and public documentation boundaries.
validation: Reviewed the MVP PRD split and confirmed the SDK doc avoids private resolver implementation references.
follow-ups: Add package manifests, protocol schemas, tests, CI, and public integration docs when implementation begins.

---

agent: Codex
branch: main
head: 4d7a56a
summary: Completed GPTS-S1-T1 by finalizing the public resolver status model in the MVP API contracts doc.
validation: Confirmed the status set matches the PRD and protocol architecture doc and separates public statuses from private diagnostics.
follow-ups: Continue SDK Sprint 1 with route registration, resolve, callback, intent, versioning, and notification contracts.

---

agent: Codex
branch: main
head: 0e93d90
summary: Completed GPTS-S1-T2 by finalizing the PayToDapp route registration contract and overlap action behavior.
validation: Confirmed the route contract rejects address/account/payment-instruction fields and preserves the Modality B boundary.
follow-ups: Continue SDK Sprint 1 with resolve, callback, intent, versioning, and notification contracts.

---

agent: Codex
branch: main
head: aed203b
summary: Completed GPTS-S1-T3 by finalizing the PayingDapp resolve request and response contract.
validation: Confirmed the contract covers resolved, no_route, and user_action_required responses without exposing wallet graph or preference details.
follow-ups: Continue SDK Sprint 1 with callback, intent, versioning, and notification contracts.

---

agent: Codex
branch: main
head: ba3d8e9
summary: Completed GPTS-S1-T4 by finalizing the resolver-to-PayToDapp provider intent callback contract.
validation: Confirmed callback shape includes resolver request id, recipient alias, selected path, amount, purpose, expiry, and authentication/replay-protection requirements.
follow-ups: Continue SDK Sprint 1 with intent, versioning, and notification contracts.

---

agent: Codex
branch: main
head: f3b8c1a
summary: Completed GPTS-S1-T5 by finalizing the MyPayTag intent schema design.
validation: Confirmed the intent uses mypaytag.intent.v1, provider_json payment instructions, single-use defaults, and no external protocol renderer commitments.
follow-ups: Continue SDK Sprint 1 with versioning and notification contracts.

---

agent: Codex
branch: main
head: d73727f
summary: Completed GPTS-S1-T6 by finalizing MVP contract versioning and compatibility rules.
validation: Confirmed schema names for mypaytag.intent.v1 and mypaytag.notification.v1 and documented pre-release and post-release compatibility expectations.
follow-ups: Finish SDK Sprint 1 with Cubid comms notification event contracts.

---

agent: Codex
branch: main
head: 85efcc2
summary: Completed GPTS-S1-T7 by finalizing public Cubid comms notification event contracts.
validation: Confirmed notification payloads use mypaytag.notification.v1 and omit wallet graphs, unrelated PayToDapps, route preferences, raw identifiers, and private diagnostics.
follow-ups: SDK Sprint 2 can implement protocol schemas and package exports from the finalized Sprint 1 contracts.

---

agent: Codex
branch: main
head: 8f04e78
summary: Tightened SDK public contracts and TODO requirements to match the MVP PRD trust-boundary updates, including explicit route network fields, safe action-token disclosure rules, callback conformance requirements, typed provider_json payload keys, and intent-created-only Cubid comms events.
validation: Confirmed SDK contract, architecture, and TODO docs no longer contain raw REVIEW notes, payment_received/payment received MVP requirements, legacy `to` destination fields, or vague minimum provider payload language.
follow-ups: Implement Sprint 2 protocol schemas from these tightened SDK contracts before backend Postgres/app and site app implementation continue.

---

agent: Codex
branch: main
head: a3629cd
summary: Completed GPTS-S2-T1 by adding the runnable PNPM TypeScript workspace and @mypaytag/protocol package with JSON Schema source files, generated TypeScript exports, Ajv validators, protocol fixtures, and validation tests.
validation: Ran pnpm --filter @mypaytag/protocol typecheck, test, and build; protocol tests covered valid fixtures plus forbidden address fields, missing network, malformed action URLs, bad provider payloads, and unsupported notification events.
follow-ups: Continue SDK Sprint 2 with PayingDapp helper implementation on top of the generated protocol types and validators.

---

agent: Codex
branch: main
head: 8c5080e
summary: Completed GPTS-S2-T2 by adding @mypaytag/sdk PayingDapp helpers for resolve request construction, response parsing, status narrowing, action URL access, and Cubid comms notification guards.
validation: Ran pnpm --filter @mypaytag/sdk typecheck, test, and build; helper tests covered request validation, resolved/action-required narrowing, action URL access, and notification parsing.
follow-ups: Continue SDK Sprint 2 with PayToDapp provider helper implementation.

---

agent: Codex
branch: main
head: 4aa94e9
summary: Completed GPTS-S2-T3 by adding @mypaytag/provider-sdk helpers for route registration validation, provider callback parsing, provider response parsing, response-to-callback matching, and auth/replay integration hooks.
validation: Ran pnpm --filter @mypaytag/provider-sdk typecheck, test, and build; tests covered route registration, callback/response validation, mismatch rejection, and replay hook behavior.
follow-ups: Finish SDK Sprint 2 with shared testing fixtures and mock services.

---

agent: Codex
branch: main
head: 7012b29
summary: Completed GPTS-S2-T4 by adding @mypaytag/testing fixtures and mocks for resolver responses, Cubid validation, PayToDapp callbacks, provider responses, forbidden route-registration fields, and the MVP payment_intent_created notification event.
validation: Ran pnpm typecheck, pnpm test, and pnpm build across the SDK workspace; all four packages passed.
follow-ups: Backend Sprint 2 can now use the SDK protocol contracts as the dependency gate for Postgres design and implementation.

---

agent: Codex
branch: main
head: e04f921
summary: Repaired the public provider payload contract before Sprint 3 so SDK schemas, fixtures, generated types, tests, and engineering docs use a typed destination object instead of top-level recipientAddress.
validation: Ran pnpm generate, pnpm typecheck, pnpm test, and pnpm build; protocol tests now reject old top-level provider recipientAddress payloads.
follow-ups: Continue SDK Sprint 3 with runnable PayingDapp and PayToDapp examples on the corrected payload contract.

---

agent: Codex
branch: main
head: 2820496
summary: Completed GPTS-S3-T1 by adding a runnable PayingDapp basic example that builds a resolve request, uses public SDK/testing helpers, and handles resolved, no-route, route-selection, and provider-unavailable outcomes.
validation: Ran pnpm example:paying-dapp, pnpm typecheck, pnpm test, and pnpm build; the example printed the resolved intent destination plus action URLs and retry guidance for non-resolved states.
follow-ups: Continue SDK Sprint 3 with the PayToDapp Modality B route-registration and provider-callback example.

---

agent: Codex
branch: main
head: 19941d8
summary: Completed GPTS-S3-T2 by adding a runnable PayToDapp Modality B example for supported-route registration, provider callback parsing, auth/replay integration hooks, and provider response validation.
validation: Ran pnpm example:payto-dapp, pnpm typecheck, pnpm test, and pnpm build; the example confirmed route registration contains no wallet address and replay auth rejects a repeated callback envelope.
follow-ups: Remove or reframe the public Modality A placeholder so MVP examples point implementers to Modality B first.

---

agent: Codex
branch: main
head: 00e601a
summary: Completed GPTS-S3-T3 by reframing the PayToDapp Modality A placeholder as an explicitly out-of-scope future note and pointing implementers to the runnable Modality B MVP example.
validation: Ran pnpm typecheck and pnpm test; scanned README, examples, docs, and TODOs to confirm Modality A no longer appears as an MVP integration path.
follow-ups: Finish SDK Sprint 3 with public integration guides for PayingDapps, PayToDapps, status handling, notifications, and fixtures.

---

agent: Codex
branch: main
head: 93491b1
summary: Completed GPTS-S3-T4 by adding public integration guides for PayingDapps, PayToDapps, status/action handling, Cubid comms notifications, and reusable testing fixtures.
validation: Ran pnpm typecheck, pnpm test, and pnpm build; scanned public docs and examples for private-repo links, stale payment_received/payment received MVP language, and stale top-level provider recipientAddress guidance.
follow-ups: SDK Sprint 3 is ready for backend and site Sprint 3 consumers to use the public examples and guides.

---

agent: Codex
branch: main
head: e1a4562
summary: Completed GPTS-S4-T1 by expanding protocol contract validation tests to cover every public status response shape, forbidden route-registration payment fields, action URL requirements, provider payload address leakage, and Cubid comms notification limits.
validation: Ran pnpm --filter @mypaytag/protocol test, typecheck, and build; protocol tests now cover 25 passing workspace test cases during the filtered run.
follow-ups: Continue SDK Sprint 4 with PayToDapp provider conformance tests for callback auth, replay, malformed payloads, and provider error behavior.

---

agent: Codex
branch: main
head: 90432f6
summary: Completed GPTS-S4-T2 by adding PayToDapp provider conformance tests for valid callback handling, MyPayTag paytag reference-only callbacks, auth freshness and replay expectations, provider error status rejection, malformed provider payload rejection, callback/response matching, and MyPayTag intent-envelope containment.
validation: Ran pnpm --filter @mypaytag/provider-sdk test, typecheck, and build; provider conformance added seven passing cases and the filtered run covered 32 passing workspace tests.
follow-ups: Continue SDK Sprint 4 with package build and publish workflow scaffolding.

---

agent: Codex
branch: main
head: 19b638a
summary: Completed GPTS-S4-T3 by adding package publish metadata, a clean workspace validation script, package dry-run packing, CI workflow coverage, guarded npm publish workflow scaffolding, and README build/test/publish instructions.
validation: Ran pnpm run validate and pnpm run pack:dry-run; validation regenerated protocol types, typechecked, tested, cleaned, built, and dry-run packed protocol, SDK, provider SDK, and testing packages without test files in package tarballs.
follow-ups: Finish SDK Sprint 4 by reviewing public docs, examples, and README files for private backend leakage.

---

agent: Codex
branch: main
head: b4a84f3
summary: Completed GPTS-S4-T4 by reviewing public README, docs, and examples for private resolver leakage and adding a reusable public-boundary scan for private repo links, backend storage internals, private deployment wiring, service-role details, and secret names.
validation: Ran pnpm run scan:public-boundary and pnpm run validate; the scan passed and full validation regenerated protocol types, typechecked, tested, scanned docs, cleaned, and rebuilt the workspace.
follow-ups: SDK Sprint 4 is complete. Backend Sprint 4 acceptance can now use the SDK validation and conformance baseline.

---

agent: Codex
branch: main
head: 7e7f2c8
summary: Updated the public protocol so only route selection carries hosted action URLs; no_route and authorization_required are status-only MVP responses.
validation: Ran pnpm generate, pnpm typecheck, pnpm test -- --run, pnpm scan:public-boundary, and pnpm build.
follow-ups: Keep SDK examples and integration copy aligned with send-to channels being enabled by default for requesting apps.

---

## 2026-06-26-gpts-s5-t1

agent: Codex
branch: feature/mypaytag-resolver-migration
todo: mypaytag-sdk:GPTS-S5-T1
summary: Defined public route quote preview contracts for generic payor-app route option and payment-intent option flows, added schema-backed generated types, fixture coverage, validator exports, and docs that separate route queries, intent options, and final resolved intents.
validation: Ran pnpm --filter @mypaytag/protocol generate, pnpm --filter @mypaytag/protocol typecheck, and pnpm --filter @mypaytag/protocol test; protocol validation now covers 37 passing workspace tests including quote preview privacy and sender-fee rules.
follow-ups: Continue with backend generic route option resolution using the SDK quote preview contract as the public boundary.

---

## 2026-06-26-gpts-s5-t2

agent: Codex
branch: feature/mypaytag-resolver-migration
todo: mypaytag-sdk:GPTS-S5-T2
summary: Completed SDK execution solver quote provider interfaces by validating the existing solver id exports, quote provider interface, preferred-solver selection, quote fanout behavior, partial provider failure handling, and all-provider failure handling.
validation: Ran pnpm --filter @mypaytag/sdk typecheck and pnpm --filter @mypaytag/sdk test; SDK tests now cover 39 passing workspace cases including quote fanout and failure behavior.
follow-ups: Continue with backend solver adapter boundaries that can consume the SDK solver ids and quote-provider behavior.

---

## 2026-06-26-gpts-s5-t3

agent: Codex
branch: feature/mypaytag-resolver-migration
todo: mypaytag-sdk:GPTS-S5-T3
summary: Added generic payor-app request builders for supported paths, amount values, payor-app references, and exactness-aware resolve request inputs while keeping the generated protocol payload backward-compatible.
validation: Ran pnpm --filter @mypaytag/sdk typecheck and pnpm --filter @mypaytag/sdk test; SDK tests now cover 42 passing workspace cases including payor-app builder validation.
follow-ups: Extend the public testing package with generic route option, quote, solver, and SmarTrust-like public-safe fixtures.

---

## 2026-06-26-gpts-s5-t4

agent: Codex
branch: feature/mypaytag-resolver-migration
todo: mypaytag-sdk:GPTS-S5-T4
summary: Extended the public testing package with generic route option fixtures, direct/exchange/bridge/cross-chain quote previews, exact-send and exact-receive execution quote requests, and reusable mock execution quote providers for preferred-solver and fanout tests.
validation: Ran pnpm --filter @mypaytag/protocol build, pnpm --filter @mypaytag/sdk build, pnpm install, pnpm --filter @mypaytag/testing typecheck, and pnpm --filter @mypaytag/testing test; testing package coverage now passes 44 workspace tests.
follow-ups: Continue with the public site solver-adapter content and checks.

---

## 2026-06-28-gpts-s6-t1

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-sdk:GPTS-S6-T1
summary: Renamed public contract fixture IDs, action IDs, docs, OpenAPI copy, and regenerated Postman examples from old gptr/pay-to-tag wording to MyPayTag mpt/paytag terminology while preserving PayToDapp compatibility terms.
validation: Ran pnpm --filter @mypaytag/protocol build, pnpm --filter @mypaytag/protocol test, pnpm --filter @mypaytag/sdk test, and pnpm scan:public-boundary; focused tests passed with 44 workspace cases and the public-boundary scan passed.
follow-ups: Continue Sprint 6 by aligning OpenAPI intent schemas with the canonical JSON Schema contract.

---

## 2026-06-28-gpts-s6-t2

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-sdk:GPTS-S6-T2
summary: Updated OpenAPI resolved-intent and provider-response components to match the canonical MyPayTag intent schema, including required envelope fields, selected route, references, provider_json metadata, and full provider payload requirements.
validation: Ran pnpm api:postman and pnpm api:validate; Postman was regenerated from api/openapi.yaml and Redocly lint passed without warnings.
follow-ups: Continue Sprint 6 by checking the public SDK contract for Cubid-internal leakage and direct Cubid probing examples.

---

## 2026-06-28-gpts-s6-t3

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-sdk:GPTS-S6-T3
summary: Reframed public request, callback, intent, notification, fixture, OpenAPI, docs, and testing surfaces around MyPayTag paytag references and generic authorization tokens instead of Cubid verified-stamp fields, Cubid aliases, or Cubid consent-token fields.
validation: Ran pnpm generate, pnpm api:postman, pnpm --filter @mypaytag/protocol build, pnpm --filter @mypaytag/protocol test, pnpm --filter @mypaytag/sdk typecheck, pnpm --filter @mypaytag/sdk test, pnpm --filter @mypaytag/provider-sdk test, pnpm --filter @mypaytag/testing test, and pnpm api:validate; focused tests passed with 44 workspace cases and OpenAPI lint passed.
follow-ups: Continue Sprint 6 by labeling execution quote helpers and solver surfaces as future/non-MVP extensions.

---

## 2026-06-28-gpts-s6-t4

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-sdk:GPTS-S6-T4
summary: Labeled crypto-native solver ids, execution quote helpers, route quote previews, bridge/swap language, and fanout behavior as future/non-MVP extensions while keeping core resolve, route registration, provider callback, hosted route selection, and intent helpers as the MVP path.
validation: Ran pnpm --filter @mypaytag/sdk typecheck, pnpm --filter @mypaytag/sdk test, and pnpm scan:public-boundary; SDK typecheck passed, focused tests passed with 44 workspace cases, and the public-boundary scan passed.
follow-ups: Continue Sprint 6 by adding paytag availability, opaque paytag, raw-explicit paytag, and negative-disclosure fixtures.

---

## 2026-06-28-gpts-s6-t5

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-sdk:GPTS-S6-T5
summary: Added reusable testing fixtures for opaque default paytags, explicit raw-stamp paytags, availability/unavailable/reserved issuance checks, and negative-disclosure responses for no_route, authorization_required, and user_action_required.
validation: Ran pnpm --filter @mypaytag/testing typecheck, pnpm --filter @mypaytag/testing test, and pnpm --filter @mypaytag/protocol test; typecheck passed and focused tests passed with 44 workspace cases.
follow-ups: Complete Sprint 6 with contract tests for OpenAPI/schema parity, forbidden route registration fields, provider payload requirements, and staged smoke documentation.

---

## 2026-06-28-gpts-s6-t6

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-sdk:GPTS-S6-T6
summary: Added protocol acceptance tests for required provider_json payload fields and OpenAPI/canonical intent parity, plus a staged smoke checklist linking SDK validation to Cubid SDK, MyPayTag backend, one test PayingDapp, and one test PayToDapp.
validation: Ran pnpm --filter @mypaytag/protocol typecheck, pnpm --filter @mypaytag/protocol test, and pnpm run validate; full validation regenerated types, linted OpenAPI, built and typechecked packages, passed tests with 46 workspace cases, passed the public-boundary scan, cleaned, and rebuilt.
follow-ups: Sprint 6 is complete; use the staged smoke checklist only after local SDK validation remains green.

---

## 2026-06-28-gpts-s7-t1

agent: Codex
branch: codex/mypaytag-mvp-realignment-20260628
todo: mypaytag-sdk:GPTS-S7-T1
summary: Added the Phase 1 NEAR Intents / 1Click quote-option protocol contract, fixture, validator, SDK parser export, and tests while documenting broad solver fanout as Phase 2.
validation: Ran pnpm generate, pnpm --filter @mypaytag/protocol build, pnpm --filter @mypaytag/protocol test, pnpm --filter @mypaytag/sdk test, pnpm --filter @mypaytag/sdk typecheck, and pnpm scan:public-boundary; focused tests passed with 48 workspace cases and the public-boundary scan passed.
follow-ups: Add selected quote confirmation and payable instruction contracts.
