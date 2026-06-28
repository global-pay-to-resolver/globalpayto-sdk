/* eslint-disable */
// Generated from packages/protocol/schemas/hosted-action-view.schema.json. Do not edit by hand.

export type HostedActionView = {
  [k: string]: unknown;
} & {
  status: "ready" | "expired" | "invalid" | "completed" | "replayed" | "restart_required";
  actionId: string;
  actionType: "route_selection";
  expiresAt?: string;
  options?: RouteOption[];
};

export interface RouteOption {
  optionId: string;
  chain: string;
  network: string;
  asset: string;
  payToDappId: string;
  displayName: string;
}
