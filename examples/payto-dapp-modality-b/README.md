# PayToDapp Modality B Example

Runnable example for a PayToDapp integrating with MyPayTag MVP.

Run from the repository root after building packages:

```sh
pnpm build
pnpm example:payto-dapp
```

The example uses public provider SDK and testing helpers. It demonstrates:

- registering supported receive routes without wallet addresses,
- parsing route list/read responses,
- building route update requests and parsing route revocation responses,
- validating a resolver provider-intent callback request,
- plugging in callback authentication and replay protection,
- returning dynamic payment instructions only inside the provider response.
