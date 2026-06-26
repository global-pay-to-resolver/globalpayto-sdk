# PayingDapp Integration

PayingDapps ask GlobalPayTo to resolve a Cubid verified-stamp recipient into a
one-time GlobalPayTo JSON intent.

## Use The SDK

- Build resolve requests with `buildResolveRequest`.
- Parse resolver responses with `parseResolveResponse`.
- Branch with `isResolved`, `isActionRequired`, `isRetryable`, and
  `isInvalidForRetry`.
- Use `getActionUrl` only when `user_action_required` includes a
  route-selection action.

Runnable example: `examples/paying-dapp-basic`.

## MVP Request Shape

PayingDapps provide:

- a Cubid verified-stamp recipient,
- supported paths containing `chain`, `network`, and `asset`,
- a one-time amount,
- a purpose,
- a PayingDapp reference for reconciliation.

The resolver response must not be treated as a wallet graph. PayingDapps should
only use the returned intent or hosted-action URL for the current payment flow.
`no_route` and `authorization_required` are status-only in the MVP; they do not
send users to per-request setup or requesting-app approval pages.

## Resolved Intents

For `resolved`, present or hand off the returned `globalpayto.intent.v1` intent.
MVP payment instructions use `provider_json` with a typed provider destination:

```json
{
  "destination": {
    "kind": "blockchain_address",
    "recipientAddress": "0xabc..."
  }
}
```

Do not infer reusable wallet details from this destination. It belongs to the
selected one-time provider intent.
