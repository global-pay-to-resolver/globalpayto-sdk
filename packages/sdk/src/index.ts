import {
  isNotificationEvent,
  validateNotificationEvent,
  validateResolveRequest,
  validateResolveResponse,
  type NotificationEvent,
  type ResolveRequest,
  type ResolveResponse,
} from "@mypaytag/protocol";

export type ResolveRequestInput = ResolveRequest;
export type SupportedPath = ResolveRequest["supportedPaths"][number];
export type ResolveAmount = ResolveRequest["amount"];
export type PayorAmountExactness = "exact_send" | "exact_receive";

export interface PayorAppReferenceInput {
  payorAppId: string;
  reference: string;
}

export interface PayorAppResolveRequestInput {
  recipientIdentifier: string;
  supportedPaths: [SupportedPath, ...SupportedPath[]] | SupportedPath[];
  amount: ResolveAmount;
  purpose: string;
  payingDappReference: string;
  amountExactness?: PayorAmountExactness;
}

export interface ExactnessAwareResolveRequest {
  request: ResolveRequest;
  amountExactness: PayorAmountExactness;
}

export type ActionRequiredStatus = "user_action_required";
export type ActionRequiredResponse = Extract<ResolveResponse, { action: unknown }>;

/**
 * Future extension solver ids. These are not required for the MVP MyPayTag
 * resolve flow, route registration flow, provider callback flow, or hosted
 * route-selection flow.
 */
export const cryptoNativeExecutionSolvers = [
  "near_intents_1click",
  "lifi",
  "squid",
  "zero_x_cross_chain",
  "across",
  "layerzero_stargate",
] as const;

export type CryptoNativeExecutionSolverId = (typeof cryptoNativeExecutionSolvers)[number];

/**
 * Future extension quote request consumed by app-configured execution adapters.
 */
export interface ExecutionQuoteRequest {
  amount: {
    value: string;
    currency: string;
  };
  destinationAsset: string;
  recipient: string;
  sourceAsset: string;
  expiresAt?: string;
  reference?: string;
  preferredSolverId?: CryptoNativeExecutionSolverId;
}

export interface ExecutionQuote {
  solverId: CryptoNativeExecutionSolverId;
  quoteId: string;
  expiresAt?: string;
  estimatedDurationSeconds?: number;
  receiveAmount?: string;
  sendAmount?: string;
  transactionRequest?: unknown;
  warnings?: string[];
}

export interface ExecutionQuoteProvider {
  solverId: CryptoNativeExecutionSolverId;
  requestQuote(request: ExecutionQuoteRequest): Promise<ExecutionQuote>;
}

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

export function buildSupportedPath(input: SupportedPath): SupportedPath {
  return {
    chain: requireNonEmpty(input.chain, "chain"),
    network: requireNonEmpty(input.network, "network"),
    asset: requireNonEmpty(input.asset, "asset"),
  };
}

export function buildAmountValue(input: ResolveAmount): ResolveAmount {
  return {
    value: requireNonEmpty(input.value, "amount.value"),
    currency: requireNonEmpty(input.currency, "amount.currency"),
  };
}

export function buildPayorAppReference(input: PayorAppReferenceInput): string {
  const payorAppId = requireNonEmpty(input.payorAppId, "payorAppId");
  const reference = requireNonEmpty(input.reference, "reference");
  return `${payorAppId}:${reference}`;
}

export function buildPayorAppResolveRequest(input: PayorAppResolveRequestInput): ExactnessAwareResolveRequest {
  const supportedPaths = input.supportedPaths.map(buildSupportedPath);
  const [firstPath, ...remainingPaths] = supportedPaths;
  if (!firstPath) {
    throw new Error("supportedPaths must include at least one route path");
  }

  const request = buildResolveRequest({
    recipient: {
      identifierType: "paytag",
      identifier: requireNonEmpty(input.recipientIdentifier, "recipientIdentifier"),
    },
    supportedPaths: [firstPath, ...remainingPaths],
    amount: buildAmountValue(input.amount),
    purpose: requireNonEmpty(input.purpose, "purpose"),
    intentMode: "one_time",
    payingDappReference: requireNonEmpty(input.payingDappReference, "payingDappReference"),
  });

  return {
    request,
    amountExactness: input.amountExactness ?? "exact_receive",
  };
}

export function parseResolveResponse(payload: unknown): ResolveResponse {
  return validateResolveResponse(payload);
}

export function parseNotificationEvent(payload: unknown): NotificationEvent {
  return validateNotificationEvent(payload);
}

export function isMyPayTagNotification(payload: unknown): payload is NotificationEvent {
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

function requireNonEmpty(value: string, fieldName: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  return trimmed;
}

/**
 * Requests non-MVP execution quotes from caller-provided providers. Core
 * MyPayTag MVP integrations can resolve paytags and handle provider callbacks
 * without calling this helper.
 */
export async function requestExecutionQuotes({
  preferredSolverId,
  providers,
  request,
}: {
  preferredSolverId?: CryptoNativeExecutionSolverId;
  providers: ExecutionQuoteProvider[];
  request: Omit<ExecutionQuoteRequest, "preferredSolverId">;
}): Promise<ExecutionQuote[]> {
  const selectedProviders = preferredSolverId
    ? providers.filter((provider) => provider.solverId === preferredSolverId)
    : providers;

  if (selectedProviders.length === 0) {
    throw new Error(preferredSolverId ? "preferred_solver_unavailable" : "no_quote_providers");
  }

  const quoteRequest = preferredSolverId ? { ...request, preferredSolverId } : request;
  const settledQuotes = await Promise.allSettled(
    selectedProviders.map((provider) => provider.requestQuote(quoteRequest)),
  );

  const quotes = settledQuotes.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
  if (quotes.length === 0) {
    throw new Error("quote_providers_unavailable");
  }

  return quotes;
}
