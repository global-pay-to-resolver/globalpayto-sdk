# PayingDapp Basic Example

Runnable example for a PayingDapp resolving a paytag recipient
into a MyPayTag JSON intent.

Run from the repository root after building packages:

```sh
pnpm build
pnpm example:paying-dapp
```

The example uses only public SDK and testing helpers. It demonstrates:

- building a resolve request with `@mypaytag/sdk`,
- parsing resolver responses,
- branching on `resolved`, `no_route`, `user_action_required`, and provider failure statuses,
- reading the typed provider destination from the normalized intent,
- building a same-chain resolve request,
- parsing a NEAR 1Click quote option, confirming the selected quote, and parsing the returned payable instruction.

The example does not probe Cubid directly and does not require LI.FI, Squid,
0x, Across, LayerZero/Stargate, or generic solver fanout for the MVP path.
