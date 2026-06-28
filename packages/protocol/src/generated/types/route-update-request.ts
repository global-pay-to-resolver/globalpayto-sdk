/* eslint-disable */
// Generated from packages/protocol/schemas/route-update-request.schema.json. Do not edit by hand.

export type RouteUpdateRequest = {
  [k: string]: unknown;
} & {
  state?: "active" | "disabled" | "revoked";
  /**
   * @minItems 1
   */
  supportedRoutes?: [Route, ...Route[]];
};

export interface Route {
  chain: string;
  network: string;
  asset: string;
}
