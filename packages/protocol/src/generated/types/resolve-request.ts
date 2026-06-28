/* eslint-disable */
// Generated from packages/protocol/schemas/resolve-request.schema.json. Do not edit by hand.

export interface ResolveRequest {
  recipient: Recipient;
  /**
   * @minItems 1
   */
  supportedPaths: [Path, ...Path[]];
  amount: Amount;
  purpose: string;
  intentMode: "one_time";
  payingDappReference: string;
}
export interface Recipient {
  identifierType: "paytag";
  identifier: string;
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
