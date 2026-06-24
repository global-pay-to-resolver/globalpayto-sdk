/* eslint-disable */
// Generated from packages/protocol/schemas/provider-callback-request.schema.json. Do not edit by hand.

export interface ProviderCallbackRequest {
  resolverRequestId: string;
  recipient: {
    identifierType: "verified_stamp";
    identifierAlias: string;
  };
  payingDappId: string;
  selectedPath: Path;
  amount: Amount;
  purpose: string;
  expiresAt: string;
}
export interface Path {
  chain: string;
  network: string;
  asset: string;
}
export interface Amount {
  value: string;
  currency: string;
}
