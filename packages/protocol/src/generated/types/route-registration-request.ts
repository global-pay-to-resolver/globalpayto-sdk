/* eslint-disable */
// Generated from packages/protocol/schemas/route-registration-request.schema.json. Do not edit by hand.

export interface RouteRegistrationRequest {
  recipient: Recipient;
  payToDappId: string;
  /**
   * @minItems 1
   */
  supportedRoutes: [Route, ...Route[]];
  authorizationToken: string;
}
export interface Recipient {
  identifierType: "paytag";
  identifier: string;
}
export interface Route {
  chain: string;
  network: string;
  asset: string;
}
