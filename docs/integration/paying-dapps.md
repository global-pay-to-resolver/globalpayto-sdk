# PayingDapp Integration

PayingDapps ask MyPayTag to resolve a paytag recipient into a
one-time MyPayTag JSON intent.

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

- a paytag recipient,
- supported paths containing `chain`, `network`, and `asset`,
- a one-time amount,
- a purpose,
- a PayingDapp reference for reconciliation.

The resolver response must not be treated as a wallet graph. PayingDapps should
only use the returned intent or hosted-action URL for the current payment flow.
`no_route` and `authorization_required` are status-only in the MVP; they do not
send users to per-request setup or requesting-app approval pages.

## Resolved Intents

For `resolved`, present or hand off the returned `mypaytag.intent.v1` intent.
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

## Future Extension: Crypto-Native Execution Quotes

The MVP resolve flow can return a NEAR Intents / 1Click quote option for SmarTrust swap/bridge Paytag payments. Broad execution quote fanout is Phase 2. When a PayingDapp supports future execution adapters, configure quote providers for the
solver/router surfaces the app can use. The initial MyPayTag SDK solver ids
are:

- `near_intents_1click`
- `lifi`
- `squid`
- `zero_x_cross_chain`
- `across`
- `layerzero_stargate`

If the app has a preferred solver for the current flow, pass that solver id and
the SDK requests only that quote. If no solver is preferred, the SDK requests
quotes from every configured provider and returns the successful results.

These adapters produce executable quote or transaction-request options. They do
not determine which PayToDapp the recipient prefers, and they must not expose
recipient wallet inventory to the PayingDapp.
