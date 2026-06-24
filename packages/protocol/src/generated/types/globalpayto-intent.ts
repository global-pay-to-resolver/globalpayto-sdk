/* eslint-disable */
// Generated from packages/protocol/schemas/globalpayto-intent.schema.json. Do not edit by hand.

export interface GlobalPayToIntent {
  id: string;
  schema: "globalpayto.intent.v1";
  status: "ready";
  modality: "provider_intent";
  recipient: {
    identifierType: "verified_stamp";
    identifierHash: string;
  };
  selectedRoute: {
    payToDappId: string;
    chain: string;
    network: string;
    asset: string;
  };
  amount: {
    value: string;
    currency: string;
  };
  expiresAt: string;
  singleUse: true;
  paymentInstruction: {
    type: "provider_json";
    provider: string;
    payload: ProviderPayload;
  };
  references: {
    resolverReference: string;
    providerReference: string;
    payingDappReference: string;
  };
}
export interface ProviderPayload {
  providerIntentId: string;
  chain: string;
  network: string;
  asset: string;
  destination: {
    kind: "blockchain_address";
    recipientAddress: string;
  };
  amount: string;
  reference: string;
  expiresAt: string;
  [k: string]: unknown;
}
