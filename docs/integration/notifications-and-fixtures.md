# Notifications And Test Fixtures

MVP notifications use Cubid comms. MyPayTag defines the public event payload
shape so integrators, the resolver, and hosted actions agree on data.

## MVP Event

The only MVP notification event is:

- `payment_intent_created`

Provider-reported receipt events are reserved for a later status-tracking phase.
Do not use notification copy that implies MyPayTag has settlement
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

Use `@mypaytag/testing` for reusable fixtures and mocks:

- valid route registration,
- forbidden address registration,
- resolved/no-route/route-selection/provider-failure resolver responses,
- opaque default paytag examples such as `abd123@cubid.mypaytag`,
- explicit raw-stamp paytag examples such as `+1234569999@phone.cubid.mypaytag`,
- paytag availability, unavailable, and reserved-name checks before issuance,
- idempotent retry, revoked-reuse-blocked, and expired-reuse-blocked paytag
  availability examples,
- negative-disclosure responses for `no_route`, `authorization_required`, and
  `user_action_required`,
- provider callback and provider response,
- `payment_intent_created` notification payload.

## Paytag Availability Placement

Paytag availability and issuance are not public integrator API contracts in the
MVP SDK. They are private MyPayTag/Cubid service-boundary checks.

Cubid owns identity, stamp evidence, and user consent. MyPayTag owns paytag
uniqueness and availability policy. The availability boundary must not send
wallet addresses, payment routes, route preferences, wallet graphs, provider
payloads, or payment instructions to Cubid.

The testing package keeps only public-safe availability fixtures so examples can
exercise available, unavailable, reserved, idempotent retry, revoked reuse, and
expired reuse cases without exposing the private service contract.
