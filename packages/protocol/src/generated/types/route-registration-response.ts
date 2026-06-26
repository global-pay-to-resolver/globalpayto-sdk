/* eslint-disable */
// Generated from packages/protocol/schemas/route-registration-response.schema.json. Do not edit by hand.

export type RouteRegistrationResponse =
  | {
      status: "resolved";
      routes: RouteRecord[];
    }
  | {
      status: "user_action_required";
      action: Action;
    };

export interface RouteRecord {
  id: string;
  payToDappId: string;
  chain: string;
  network: string;
  asset: string;
  state: "active" | "disabled" | "revoked";
}
export interface Action {
  type: "route_selection";
  url: string;
  expiresAt: string;
}
