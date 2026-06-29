/* eslint-disable */
// Generated from packages/protocol/schemas/hosted-action-completion.schema.json. Do not edit by hand.

export type HostedActionCompletion = {
  [k: string]: unknown;
} & {
  status:
    | "selected_route"
    | "unchanged"
    | "denied"
    | "completed"
    | "expired"
    | "invalid"
    | "replayed"
    | "restart_required";
  actionId: string;
  selectedOptionId?: string;
};
