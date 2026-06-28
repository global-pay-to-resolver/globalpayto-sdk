import Ajv2020, { type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { protocolSchemas } from "./generated/schemas.js";
import type {
  MyPayTagIntent,
  NearOneClickPayableInstruction,
  NearOneClickQuoteOption,
  NearOneClickQuoteSelectionRequest,
  MyPayTagStatus,
  NotificationEvent,
  PayToRoute,
  ProviderCallbackRequest,
  ProviderResponse,
  RouteDeleteResponse,
  RouteListResponse,
  RouteQuotePreview,
  RouteReadResponse,
  ResolveRequest,
  ResolveResponse,
  RouteRegistrationRequest,
  RouteRegistrationResponse,
  RouteUpdateRequest,
} from "./generated/types.js";

export class ProtocolValidationError extends Error {
  readonly errors: ErrorObject[] | null | undefined;

  constructor(schemaName: ProtocolSchemaName, errors: ErrorObject[] | null | undefined) {
    super(`Invalid MyPayTag ${schemaName} payload`);
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
  validateProtocolPayload<MyPayTagStatus>("status", payload);

export const validateRouteRegistrationRequest = (payload: unknown) =>
  validateProtocolPayload<RouteRegistrationRequest>("route-registration-request", payload);

export const validateRouteRegistrationResponse = (payload: unknown) =>
  validateProtocolPayload<RouteRegistrationResponse>("route-registration-response", payload);

export const validatePayToRoute = (payload: unknown) =>
  validateProtocolPayload<PayToRoute>("pay-to-route", payload);

export const validateRouteListResponse = (payload: unknown) =>
  validateProtocolPayload<RouteListResponse>("route-list-response", payload);

export const validateRouteReadResponse = (payload: unknown) =>
  validateProtocolPayload<RouteReadResponse>("route-read-response", payload);

export const validateRouteUpdateRequest = (payload: unknown) =>
  validateProtocolPayload<RouteUpdateRequest>("route-update-request", payload);

export const validateRouteDeleteResponse = (payload: unknown) =>
  validateProtocolPayload<RouteDeleteResponse>("route-delete-response", payload);

export const validateResolveRequest = (payload: unknown) =>
  validateProtocolPayload<ResolveRequest>("resolve-request", payload);

export const validateResolveResponse = (payload: unknown) =>
  validateProtocolPayload<ResolveResponse>("resolve-response", payload);

export const validateProviderCallbackRequest = (payload: unknown) =>
  validateProtocolPayload<ProviderCallbackRequest>("provider-callback-request", payload);

export const validateProviderResponse = (payload: unknown) =>
  validateProtocolPayload<ProviderResponse>("provider-response", payload);

export const validateMyPayTagIntent = (payload: unknown) =>
  validateProtocolPayload<MyPayTagIntent>("mypaytag-intent", payload);

export const validateNotificationEvent = (payload: unknown) =>
  validateProtocolPayload<NotificationEvent>("notification-event", payload);

export const validateRouteQuotePreview = (payload: unknown) =>
  validateProtocolPayload<RouteQuotePreview>("route-quote-preview", payload);

export const validateNearOneClickQuoteOption = (payload: unknown) =>
  validateProtocolPayload<NearOneClickQuoteOption>("near-one-click-quote-option", payload);

export const validateNearOneClickQuoteSelectionRequest = (payload: unknown) =>
  validateProtocolPayload<NearOneClickQuoteSelectionRequest>("near-one-click-quote-selection-request", payload);

export const validateNearOneClickPayableInstruction = (payload: unknown) =>
  validateProtocolPayload<NearOneClickPayableInstruction>("near-one-click-payable-instruction", payload);

export const isNotificationEvent = (payload: unknown): payload is NotificationEvent =>
  isProtocolPayload<NotificationEvent>("notification-event", payload);
