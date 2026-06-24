import Ajv2020, { type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { protocolSchemas } from "./generated/schemas.js";
import type {
  GlobalPayToIntent,
  GlobalPayToStatus,
  NotificationEvent,
  ProviderCallbackRequest,
  ProviderResponse,
  ResolveRequest,
  ResolveResponse,
  RouteRegistrationRequest,
  RouteRegistrationResponse,
} from "./generated/types.js";

export class ProtocolValidationError extends Error {
  readonly errors: ErrorObject[] | null | undefined;

  constructor(schemaName: ProtocolSchemaName, errors: ErrorObject[] | null | undefined) {
    super(`Invalid GlobalPayTo ${schemaName} payload`);
    this.name = "ProtocolValidationError";
    this.errors = errors;
  }
}

export type ProtocolSchemaName = keyof typeof protocolSchemas;

const ajv = new Ajv2020({
  allErrors: true,
  removeAdditional: false,
  strict: false,
});

addFormats(ajv);

const validators = Object.fromEntries(
  Object.entries(protocolSchemas).map(([name, schema]) => [
    name,
    ajv.compile(schema),
  ]),
) as Record<ProtocolSchemaName, ValidateFunction>;

export function validateProtocolPayload<T>(schemaName: ProtocolSchemaName, payload: unknown): T {
  const validate = validators[schemaName];

  if (!validate(payload)) {
    throw new ProtocolValidationError(schemaName, validate.errors);
  }

  return payload as T;
}

export function isProtocolPayload<T>(schemaName: ProtocolSchemaName, payload: unknown): payload is T {
  return validators[schemaName](payload) as boolean;
}

export const validateStatus = (payload: unknown) =>
  validateProtocolPayload<GlobalPayToStatus>("status", payload);

export const validateRouteRegistrationRequest = (payload: unknown) =>
  validateProtocolPayload<RouteRegistrationRequest>("route-registration-request", payload);

export const validateRouteRegistrationResponse = (payload: unknown) =>
  validateProtocolPayload<RouteRegistrationResponse>("route-registration-response", payload);

export const validateResolveRequest = (payload: unknown) =>
  validateProtocolPayload<ResolveRequest>("resolve-request", payload);

export const validateResolveResponse = (payload: unknown) =>
  validateProtocolPayload<ResolveResponse>("resolve-response", payload);

export const validateProviderCallbackRequest = (payload: unknown) =>
  validateProtocolPayload<ProviderCallbackRequest>("provider-callback-request", payload);

export const validateProviderResponse = (payload: unknown) =>
  validateProtocolPayload<ProviderResponse>("provider-response", payload);

export const validateGlobalPayToIntent = (payload: unknown) =>
  validateProtocolPayload<GlobalPayToIntent>("globalpayto-intent", payload);

export const validateNotificationEvent = (payload: unknown) =>
  validateProtocolPayload<NotificationEvent>("notification-event", payload);

export const isNotificationEvent = (payload: unknown): payload is NotificationEvent =>
  isProtocolPayload<NotificationEvent>("notification-event", payload);
