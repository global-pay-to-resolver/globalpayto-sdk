# Staged Smoke Checklist

Run this checklist only after local SDK validation passes.

## Local SDK Gate

- Run `pnpm run validate` in `mypaytag-sdk`.
- Confirm generated protocol types, OpenAPI lint, package typecheck, tests, public-boundary scan, clean, and build all pass.
- Confirm `api/postman_collection.json` was regenerated from `api/openapi.yaml` when the API contract changed.

## Hosted Staging Smoke

- Cubid SDK can open Cubid-hosted paytag identity and consent actions without exposing wallet, route, provider, asset, payment intent, settlement, solver, bridge, swap, or execution fields.
- MyPayTag backend accepts a paytag resolve request using the SDK shape and validates identity/consent through Cubid without exposing Cubid internals to the PayingDapp.
- One test PayingDapp calls MyPayTag, not Cubid, with a paytag such as `abd123@cubid.mypaytag`.
- One test PayToDapp registers supported routes without wallet addresses or payment instructions.
- MyPayTag returns `no_route`, `authorization_required`, and `user_action_required` without leaking whether a person, paytag, Cubid user, route, or PayToDapp exists.
- MyPayTag selects a compatible route or returns hosted route selection, then calls the selected PayToDapp provider callback.
- The selected PayToDapp returns a provider response with all required `provider_json.payload` fields: provider intent id, chain, network, asset, destination, amount, reference, and expiry.
- MyPayTag returns a normalized `mypaytag.intent.v1` response matching the SDK schema.

## Launch Evidence

- Attach local SDK validation output before treating hosted staging smoke as launch-readiness evidence.
- Record the Cubid SDK version, MyPayTag backend commit, MyPayTag SDK commit, test PayingDapp commit, and test PayToDapp commit used in staging.
