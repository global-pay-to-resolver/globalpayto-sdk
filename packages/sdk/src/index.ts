import {
  isNotificationEvent,
  validateNotificationEvent,
  validateResolveRequest,
  validateResolveResponse,
  type NotificationEvent,
  type ResolveRequest,
  type ResolveResponse,
} from "@globalpayto/protocol";

export type ResolveRequestInput = ResolveRequest;

export type ActionRequiredStatus = "user_action_required";
export type ActionRequiredResponse = Extract<ResolveResponse, { action: unknown }>;

export type RetryableStatus = "provider_unavailable";

export type InvalidRequestStatus =
  | "invalid_request"
  | "invalid_identifier"
  | "unsupported_path"
  | "expired_authorization"
  | "revoked_authorization";

export function buildResolveRequest(input: ResolveRequestInput): ResolveRequest {
  return validateResolveRequest(input);
}

export function parseResolveResponse(payload: unknown): ResolveResponse {
  return validateResolveResponse(payload);
}

export function parseNotificationEvent(payload: unknown): NotificationEvent {
  return validateNotificationEvent(payload);
}

export function isGlobalPayToNotification(payload: unknown): payload is NotificationEvent {
  return isNotificationEvent(payload);
}

export function isResolved(response: ResolveResponse): response is Extract<ResolveResponse, { status: "resolved" }> {
  return response.status === "resolved";
}

export function isActionRequired(
  response: ResolveResponse,
): response is ActionRequiredResponse {
  return response.status === "user_action_required";
}

export function isRetryable(response: ResolveResponse): response is Extract<ResolveResponse, { status: RetryableStatus }> {
  return response.status === "provider_unavailable";
}

export function isInvalidForRetry(
  response: ResolveResponse,
): response is Extract<ResolveResponse, { status: InvalidRequestStatus }> {
  return (
    response.status === "invalid_request" ||
    response.status === "invalid_identifier" ||
    response.status === "unsupported_path" ||
    response.status === "expired_authorization" ||
    response.status === "revoked_authorization"
  );
}

export function getActionUrl(response: ResolveResponse): string | undefined {
  return isActionRequired(response) ? response.action.url : undefined;
}
