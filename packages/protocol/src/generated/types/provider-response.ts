/* eslint-disable */
// Generated from packages/protocol/schemas/provider-response.schema.json. Do not edit by hand.

export interface ProviderResponse {
  providerIntentId: string;
  status: "ready";
  paymentInstruction: {
    type: "provider_json";
    provider: string;
    payload: ProviderPayload;
  };
}
export interface ProviderPayload {
  providerIntentId: string;
  resolverReference: string;
  payingDappId: string;
  payingDappReference: string;
  chain: string;
  network: string;
  asset: string;
  destination: {
    kind: "blockchain_address";
    recipientAddress: string;
  };
  amount: string;
  purpose: string;
  reference: string;
  expiresAt: string;
  [k: string]: unknown;
}
