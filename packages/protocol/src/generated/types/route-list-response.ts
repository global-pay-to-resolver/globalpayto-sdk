/* eslint-disable */
// Generated from packages/protocol/schemas/route-list-response.schema.json. Do not edit by hand.

export interface RouteListResponse {
  status: "resolved";
  routes: PayToRoute[];
}
export interface PayToRoute {
  id: string;
  payToDappId: string;
  chain: string;
  network: string;
  asset: string;
  state: "active" | "disabled" | "revoked";
}
