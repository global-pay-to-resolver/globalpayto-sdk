/* eslint-disable */
// Generated from packages/protocol/schemas/pay-to-route.schema.json. Do not edit by hand.

export interface PayToRoute {
  id: string;
  payToDappId: string;
  chain: string;
  network: string;
  asset: string;
  state: "active" | "disabled" | "revoked";
}
