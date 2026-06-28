import {
  validateProviderCallbackRequest,
  validateProviderResponse,
  validateRouteRegistrationRequest,
  type ProviderCallbackRequest,
  type ProviderResponse,
  type RouteRegistrationRequest,
} from "@mypaytag/protocol";

export interface CallbackAuthEnvelope {
  method: string;
  url: string;
  bodyDigest: string;
  resolverRequestId: string;
  signature: string;
  nonce: string;
  timestamp: string;
  expiresAt: string;
}

export interface CallbackAuthVerifier {
  verify(envelope: CallbackAuthEnvelope): boolean | Promise<boolean>;
}

export interface ReplayStore {
  has(key: string): boolean | Promise<boolean>;
  remember(key: string, expiresAt: string): void | Promise<void>;
}

export interface CallbackFreshnessOptions {
  now?: Date;
  maxFutureSkewMs?: number;
}

export function buildRouteRegistrationRequest(input: RouteRegistrationRequest): RouteRegistrationRequest {
  return validateRouteRegistrationRequest(input);
}

export function parseProviderCallbackRequest(payload: unknown): ProviderCallbackRequest {
  return validateProviderCallbackRequest(payload);
}

export function parseProviderResponse(payload: unknown): ProviderResponse {
  return validateProviderResponse(payload);
}

export async function verifyCallbackAuth(
  envelope: CallbackAuthEnvelope,
  verifier: CallbackAuthVerifier,
  replayStore: ReplayStore,
  options: CallbackFreshnessOptions = {},
): Promise<boolean> {
  const now = options.now ?? new Date();
  const maxFutureSkewMs = options.maxFutureSkewMs ?? 5 * 60 * 1000;
  const timestampMs = Date.parse(envelope.timestamp);
  const expiresAtMs = Date.parse(envelope.expiresAt);

  if (!Number.isFinite(timestampMs) || !Number.isFinite(expiresAtMs)) return false;
  if (expiresAtMs <= now.getTime()) return false;
  if (timestampMs > now.getTime() + maxFutureSkewMs) return false;
  if (timestampMs > expiresAtMs) return false;

  const replayKey = `${envelope.resolverRequestId}:${envelope.nonce}:${envelope.timestamp}`;

  if (await replayStore.has(replayKey)) {
    return false;
  }

  const verified = await verifier.verify(envelope);

  if (!verified) {
    return false;
  }

  await replayStore.remember(replayKey, envelope.expiresAt);
  return true;
}

export function assertProviderResponseMatchesCallback(
  callback: ProviderCallbackRequest,
  response: ProviderResponse,
): ProviderResponse {
  const payload = response.paymentInstruction.payload;

  if (
    payload.chain !== callback.selectedPath.chain ||
    payload.network !== callback.selectedPath.network ||
    payload.asset !== callback.selectedPath.asset ||
    payload.amount !== callback.amount.value ||
    payload.providerIntentId !== response.providerIntentId
  ) {
    throw new Error("Provider response does not match callback request");
  }

  return response;
}
