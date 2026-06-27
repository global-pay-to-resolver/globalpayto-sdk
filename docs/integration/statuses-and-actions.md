# Status And Hosted-Action Handling

MyPayTag public statuses are the only statuses integrators should branch on.
Private diagnostics are not part of the public contract.

## Success

- `resolved`: a one-time MyPayTag intent is ready.

## Hosted Action Required

- `user_action_required`: send the user to the route-selection URL when provided.

Action URLs are opaque, short-lived hosted links. They must not be parsed for
recipient, route, provider, wallet, preference, authorization, or diagnostic
details. The public site signs the user in with Cubid before hydrating route
details.

## Status Only

- `no_route`: show safe no-route copy; do not infer whether the recipient exists
  or has other routes.
- `authorization_required`: show safe authorization-required copy or use a
  Cubid-owned grant path when one exists.

`no_route` and `authorization_required` do not link to per-request setup or
requesting-app approval pages in the MVP.

## Retry Later

- `provider_unavailable`: show a temporary failure and retry later if the user
  flow allows.

## Do Not Blindly Retry

- `invalid_request`
- `invalid_identifier`
- `unsupported_path`
- `provider_error`
- `expired_authorization`
- `revoked_authorization`

These statuses require a request change, user action, provider fix, or renewed
authorization before another attempt.
