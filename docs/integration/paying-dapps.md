# PayingDapp Integration

PayingDapps ask GlobalPayTo to resolve a Cubid verified-stamp recipient into a
one-time GlobalPayTo JSON intent.

## Use The SDK

- Build resolve requests with `buildResolveRequest`.
- Parse resolver responses with `parseResolveResponse`.
- Branch with `isResolved`, `isActionRequired`, `isRetryable`, and
  `isInvalidForRetry`.
- Use `getActionUrl` for `no_route`, `authorization_required`, and
  `user_action_required` responses.

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
