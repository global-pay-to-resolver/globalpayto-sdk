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
summary: Completed GPTS-S1-T5 by finalizing the GlobalPayTo intent schema design.
validation: Confirmed the intent uses globalpayto.intent.v1, provider_json payment instructions, single-use defaults, and no external protocol renderer commitments.
follow-ups: Continue SDK Sprint 1 with versioning and notification contracts.

---

agent: Codex
branch: main
head: d73727f
summary: Completed GPTS-S1-T6 by finalizing MVP contract versioning and compatibility rules.
validation: Confirmed schema names for globalpayto.intent.v1 and globalpayto.notification.v1 and documented pre-release and post-release compatibility expectations.
follow-ups: Finish SDK Sprint 1 with Cubid comms notification event contracts.

---

agent: Codex
branch: main
head: 85efcc2
summary: Completed GPTS-S1-T7 by finalizing public Cubid comms notification event contracts.
validation: Confirmed notification payloads use globalpayto.notification.v1 and omit wallet graphs, unrelated PayToDapps, route preferences, raw identifiers, and private diagnostics.
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
summary: Completed GPTS-S2-T1 by adding the runnable PNPM TypeScript workspace and @globalpayto/protocol package with JSON Schema source files, generated TypeScript exports, Ajv validators, protocol fixtures, and validation tests.
validation: Ran pnpm --filter @globalpayto/protocol typecheck, test, and build; protocol tests covered valid fixtures plus forbidden address fields, missing network, malformed action URLs, bad provider payloads, and unsupported notification events.
follow-ups: Continue SDK Sprint 2 with PayingDapp helper implementation on top of the generated protocol types and validators.

---

agent: Codex
branch: main
head: 8c5080e
summary: Completed GPTS-S2-T2 by adding @globalpayto/sdk PayingDapp helpers for resolve request construction, response parsing, status narrowing, action URL access, and Cubid comms notification guards.
validation: Ran pnpm --filter @globalpayto/sdk typecheck, test, and build; helper tests covered request validation, resolved/action-required narrowing, action URL access, and notification parsing.
follow-ups: Continue SDK Sprint 2 with PayToDapp provider helper implementation.

---

agent: Codex
branch: main
head: 4aa94e9
summary: Completed GPTS-S2-T3 by adding @globalpayto/provider-sdk helpers for route registration validation, provider callback parsing, provider response parsing, response-to-callback matching, and auth/replay integration hooks.
validation: Ran pnpm --filter @globalpayto/provider-sdk typecheck, test, and build; tests covered route registration, callback/response validation, mismatch rejection, and replay hook behavior.
follow-ups: Finish SDK Sprint 2 with shared testing fixtures and mock services.

---

agent: Codex
branch: main
head: 7012b29
summary: Completed GPTS-S2-T4 by adding @globalpayto/testing fixtures and mocks for resolver responses, Cubid validation, PayToDapp callbacks, provider responses, forbidden route-registration fields, and the MVP payment_intent_created notification event.
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
