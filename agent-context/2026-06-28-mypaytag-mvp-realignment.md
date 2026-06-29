# MyPayTag MVP Realignment Instruction

Date: 2026-06-28
Repo: `mypaytag-sdk`
Status: implementation instruction

## Cross-Repo Instruction Set

This is one of five coordinated instruction docs:

- `mypaytag-backend`: `/Users/botmaster/src/myPayTag/mypaytag-backend/agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- `mypaytag-sdk`: `/Users/botmaster/src/myPayTag/mypaytag-sdk/agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- `mypaytag-site`: `/Users/botmaster/src/myPayTag/mypaytag-site/agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- `cubid-monorepo`: `/Users/botmaster/src/cubid/cubid-monorepo/agent-context/2026-06-28-mypaytag-mvp-realignment.md`
- `cubid-sdk-v2`: `/Users/botmaster/src/cubid/cubid-sdk-v2/agent-context/2026-06-28-mypaytag-mvp-realignment.md`

When touching this repo, read the other four docs first and preserve the ownership split.

## Naming Requirement

Request and implement the rename from `GlobalPayTo` / `globalpayto` / `gptr` language to `MyPayTag` / `mypaytag` / `mpt` where that text is public package metadata, schemas, generated types, examples, docs, OpenAPI, Postman collections, fixtures, tests, and published-contract names. Keep backwards-compatible aliases only when needed for package consumers or staged migrations, and mark them explicitly as compatibility.

## Product Boundary

Do not remove public docs or helper material about future solver/execution adapters solely because it is beyond MVP. Instead, ensure the MVP contract is correct and future execution helpers are clearly not required for MVP resolution.

`mypaytag-sdk` owns the public MyPayTag contract for:

- PayingDapp resolve requests and responses.
- PayToDapp route registration requests and responses.
- Provider callback request/response contracts.
- Hosted route-selection action contracts that MyPayTag owns.
- MyPayTag intent schema and fixtures.

It must not define Cubid-owned user stamp elevation, opaque paytag creation, Cubid grant management, or Cubid authenticated user-session APIs. Those belong in `cubid-monorepo` and `cubid-sdk-v2`.

## Product Decisions To Preserve

- A paytag is a MyPayTag-branded payment identity powered by Cubid identity and consent primitives.
- Paytags are universal global identifiers for PayingDapps at the public protocol layer.
- Implementation may default to PayToDapp-scoped identifiers behind the scenes until global availability and non-Cubid identity provider support are ready.
- Opaque Cubid-backed paytags such as `abd123@cubid.mypaytag` are the default. Raw stamp-based paytags such as `+1234569999@phone.cubid.mypaytag` require explicit user choice.
- MyPayTag validates paytag uniqueness and availability before issuance, in preparation for future identity providers beyond Cubid.
- MyPayTag stores Cubid-issued opaque aliases or stable references where possible, plus hashes for lookup and audit. Raw paytags are avoided unless explicitly user-chosen.
- MVP supports multiple paytags per user, with each paytag initially mapped to one Cubid stamp or one opaque Cubid-backed alias.
- Launch readiness requires local tests first, then hosted staging smoke across Cubid, MyPayTag, one test PayingDapp, and one test PayToDapp.

## SDK Work Required

1. Make OpenAPI match the canonical MyPayTag intent schema.
   - `api/openapi.yaml` must require the same intent fields as `packages/protocol/schemas/mypaytag-intent.schema.json`.
   - Require `provider_json` payload fields: provider intent id, chain, network, asset, destination, amount, reference, and expiry.
   - Remove weaker examples that only require `destination`.

2. Keep Cubid out of the MyPayTag API contract except as an external identity/consent dependency.
   - MyPayTag public contracts should accept a paytag/opaque paytag reference and rely on backend validation against Cubid.
   - Do not expose Cubid internal ids, raw Cubid user ids, Cubid grant internals, or Cubid stamp management APIs in this SDK.
   - PayingDapps integrate with MyPayTag, not Cubid. Do not add public examples where a PayingDapp directly probes Cubid for paytag state.

3. Separate MVP helpers from future execution helpers.
   - Resolve and provider callback helpers are MVP.
   - Solver quote helpers, preferred solver ids, bridge/swap/cross-chain quote previews, and execution fanout are future/extension helpers.
   - Keep future helpers if useful, but label them as non-MVP and ensure examples do not imply they are required for the core resolve flow.

4. Align terminology.
   - Use `PayingDapp`, `PayToDapp`, `paytag`, `opaque paytag`, `route`, and `MyPayTag intent` consistently.
   - Avoid saying Cubid resolves payments or routes.
   - Avoid saying Cubid owns wallets or payment destinations.
   - Present paytags as universal for PayingDapps while noting the implementation may use PayToDapp-scoped aliases internally.

5. Add contract tests.
   - OpenAPI examples, JSON Schemas, generated TypeScript types, and SDK fixtures must agree.
   - Add tests that reject route registration with wallet addresses or payment instructions.
   - Add tests that reject provider responses missing required `provider_json` fields.
   - Add negative-disclosure fixture coverage for `no_route`, `authorization_required`, and `user_action_required`.
   - Add fixtures for opaque and raw-explicit paytag examples and for paytag uniqueness/availability checks.

6. Validation target.
   - Run the repo validation command after changes.
   - Regenerate derived OpenAPI/Postman/generated schema artifacts only through repo scripts.
   - Include a staged smoke checklist that pairs this SDK with Cubid SDK and one test PayingDapp/PayToDapp integration.

## Done Means

This repo is realigned when integrators can build against an accurate MVP MyPayTag protocol without learning or depending on Cubid internals, and without needing any solver/execution helper to complete the MVP resolve flow.
