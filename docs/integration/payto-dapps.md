# PayToDapp Modality B Integration

PayToDapps register supported receive routes for a user and create dynamic
payment instructions only after the resolver selects them for a payment.

Runnable example: `examples/payto-dapp-modality-b`.

## Route Registration

Use `buildRouteRegistrationRequest` to submit route availability:

- recipient verified stamp,
- PayToDapp id,
- supported routes with `chain`, `network`, and `asset`,
- Cubid consent token.

Route registration must not include wallet addresses, accounts, payment links,
memos, or chain-specific payment instructions. Those details are selected later
inside the provider response.

## Provider Intent Callback

Use provider SDK helpers to:

- parse callback requests,
- verify callback authentication metadata,
- reject replayed callback envelopes,
- validate provider responses,
- assert provider response path and amount match the callback.

Repeated callbacks with the same resolver request should be handled
idempotently by the PayToDapp. Replayed nonce/timestamp combinations should be
rejected.

## Provider Response

Return a `ready` provider response with a `provider_json` instruction. MVP
destinations are nested under `payload.destination`; top-level address fields
are rejected by protocol validators.
