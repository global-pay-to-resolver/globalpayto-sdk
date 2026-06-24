# Notifications And Test Fixtures

MVP notifications use Cubid comms. GlobalPayTo defines the public event payload
shape so integrators, the resolver, and hosted actions agree on data.

## MVP Event

The only MVP notification event is:

- `payment_intent_created`

Provider-reported receipt events are reserved for a later status-tracking phase.
Do not use notification copy that implies GlobalPayTo has settlement
responsibility.

## Payload Boundaries

Notification payloads may contain:

- masked recipient display,
- public amount,
- public reconciliation references,
- an action descriptor when needed by a future contracted event.

Notification payloads must not contain wallet graphs, unrelated PayToDapps,
route preferences, provider internals, raw identifiers, private diagnostics, or
settlement claims.

## Fixtures

Use `@globalpayto/testing` for reusable fixtures and mocks:

- valid route registration,
- forbidden address registration,
- resolved/no-route/route-selection/provider-failure resolver responses,
- provider callback and provider response,
- `payment_intent_created` notification payload.
