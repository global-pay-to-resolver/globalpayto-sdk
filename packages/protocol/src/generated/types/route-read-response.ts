/* eslint-disable */
// Generated from packages/protocol/schemas/route-read-response.schema.json. Do not edit by hand.

export type RouteReadResponse =
  | {
      status: "resolved";
      route: PayToRoute;
    }
  | {
      status: "no_route" | "provider_unavailable";
    };

export interface PayToRoute {
  id: string;
  payToDappId: string;
  chain: string;
  network: string;
  asset: string;
  state: "active" | "disabled" | "revoked";
}
