/* eslint-disable */
// Generated from packages/protocol/schemas/route-registration-request.schema.json. Do not edit by hand.

export interface RouteRegistrationRequest {
  recipient: Recipient;
  payToDappId: string;
  /**
   * @minItems 1
   */
  supportedRoutes: [Route, ...Route[]];
  consentToken: string;
}
export interface Recipient {
  identifierType: "verified_stamp";
  identifier: string;
}
export interface Route {
  chain: string;
  network: string;
  asset: string;
}
