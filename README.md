# GlobalPayTo SDK

Public developer-facing protocol and SDK workspace for GlobalPayTo.

This repo should become the source of truth for request and response contracts, client SDKs, provider helpers, mocks, examples, and integration documentation.

## Architecture

- [Protocol and SDK architecture](docs/engineering/protocol-and-sdk-architecture.md)
- [Public integration guides](docs/integration/README.md)
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

The SDK workspace now has runnable protocol, client SDK, provider SDK, testing, and example packages.

## Local Development

Install dependencies:

```sh
pnpm install
```

Regenerate protocol TypeScript types from JSON Schema:

```sh
pnpm generate
```

Run the full local validation sequence:

```sh
pnpm run validate
```

Run individual checks:

```sh
pnpm typecheck
pnpm test
pnpm scan:public-boundary
pnpm build
```

Run examples:

```sh
pnpm example:paying-dapp
pnpm example:payto-dapp
```

Dry-run package packing for the public packages:

```sh
pnpm pack:dry-run
```

## Publishing

Publishing is scaffolded through `.github/workflows/publish.yml`. The workflow validates the workspace before publishing and requires `NPM_TOKEN` for real publishes. Normal pushes do not publish packages.

Real package publishing is intended for `sdk-v*` tags or an explicit manual workflow dispatch with `dry_run` set to `false`.
