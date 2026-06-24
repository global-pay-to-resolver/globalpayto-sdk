# PayingDapp Basic Example

Runnable example for a PayingDapp resolving a Cubid verified-stamp recipient
into a GlobalPayTo JSON intent.

Run from the repository root after building packages:

```sh
pnpm build
pnpm example:paying-dapp
```

The example uses only public SDK and testing helpers. It demonstrates:

- building a resolve request with `@globalpayto/sdk`,
- parsing resolver responses,
- branching on `resolved`, `no_route`, `user_action_required`, and provider failure statuses,
- reading the typed provider destination from the normalized intent.
