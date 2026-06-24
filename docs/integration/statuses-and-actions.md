# Status And Hosted-Action Handling

GlobalPayTo public statuses are the only statuses integrators should branch on.
Private diagnostics are not part of the public contract.

## Success

- `resolved`: a one-time GlobalPayTo intent is ready.

## Hosted Action Required

- `no_route`: send the user to the setup URL when provided.
- `authorization_required`: send the user to the authorization URL when provided.
- `user_action_required`: send the user to the route-selection URL when provided.

Action URLs are opaque, short-lived hosted links. They must not be parsed for
recipient, route, provider, wallet, preference, authorization, or diagnostic
details.

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
