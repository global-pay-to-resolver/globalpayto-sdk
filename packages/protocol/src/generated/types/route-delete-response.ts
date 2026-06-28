/* eslint-disable */
// Generated from packages/protocol/schemas/route-delete-response.schema.json. Do not edit by hand.

export type RouteDeleteResponse =
  | {
      status: "revoked";
      routeId: string;
    }
  | {
      status: "no_route" | "provider_unavailable";
    };
