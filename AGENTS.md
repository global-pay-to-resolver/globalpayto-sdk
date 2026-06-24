# Agent Notes

## Repository Role

`globalpayto-sdk` is the public developer-facing contract for GlobalPayTo. It should own protocol schemas, TypeScript SDK packages, provider helpers, mock services, test vectors, examples, and integration docs.

The private backend should import public protocol packages from here once they exist.

## Structure

- `packages/protocol/`: schemas, TypeScript types, enums, OpenAPI source, error codes, and test vectors.
- `packages/sdk/`: client helpers for PayingDapp, PayToDapp, and resolver integrations.
- `packages/provider-sdk/`: helpers for provider or Modality B callback integrations.
- `packages/testing/`: mock resolver, mock Cubid validator, mock PayToDapp, fixtures, and test vectors.
- `examples/`: runnable integration examples.
- `docs/`: public integration docs.

Current-state engineering docs belong in `docs/engineering/`. Target-state plans belong in `docs/engineering/target-state/`.

## Supabase

The Supabase direct-access rule does not apply to this repo by default. This repo should not own production database access. If a mock server or local test fixture is added, keep it clearly separate from production resolver behavior.

## Agent Context

Use `agent-context/session-log/` as the canonical session log location. Update the current branch log before committing. Keep `agent-context/todo.md` for active follow-ups only, not completed history. Keep deferred ideas in `agent-context/future-ideas.md`.

