# MyPayTag SDK

Public developer-facing protocol and SDK workspace for MyPayTag.

This repo should become the source of truth for request and response contracts, client SDKs, provider helpers, mocks, examples, and integration documentation.

## Architecture

- [Protocol and SDK architecture](docs/engineering/protocol-and-sdk-architecture.md)
- [Public integration guides](docs/integration/README.md)
- [Canonical OpenAPI 3.1 contract](openapi/openapi.yaml)
- Hosted user-action UX lives in the sibling `mypaytag-site` repo.

The public site publishes a copy of the OpenAPI contract at `/openapi.yaml`
and renders it with Scalar at `/reference`.

## Intended Packages

- `@mypaytag/protocol`
- `@mypaytag/sdk`
- `@mypaytag/provider-sdk`
- `@mypaytag/testing`

## Initial Layout

- `packages/protocol/`
- `packages/sdk/`
- `packages/provider-sdk/`
- `packages/testing/`
- `examples/paying-dapp-basic/`
- `examples/payto-dapp-modality-b/`
- `examples/payto-dapp-modality-a/` - future/out-of-scope note only; not an MVP integration path.
- `openapi/`
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
