# GlobalPayTo SDK

Public developer-facing protocol and SDK workspace for GlobalPayTo.

This repo should become the source of truth for request and response contracts, client SDKs, provider helpers, mocks, examples, and integration documentation.

## Architecture

- [Protocol and SDK architecture](docs/engineering/protocol-and-sdk-architecture.md)
- Hosted user-action UX lives in the sibling `globalpayto-site` repo.

## Intended Packages

- `@globalpayto/protocol`
- `@globalpayto/sdk`
- `@globalpayto/provider-sdk`
- `@globalpayto/testing`

## Initial Layout

- `packages/protocol/`
- `packages/sdk/`
- `packages/provider-sdk/`
- `packages/testing/`
- `examples/paying-dapp-basic/`
- `examples/payto-dapp-modality-b/`
- `examples/payto-dapp-modality-a/` - future/out-of-scope note only; not an MVP integration path.
- `docs/`

## Development Status

This is a scaffolded repo. Build, test, package, and publishing commands should be added when the first package lands.
