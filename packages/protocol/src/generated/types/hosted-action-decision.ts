/* eslint-disable */
// Generated from packages/protocol/schemas/hosted-action-decision.schema.json. Do not edit by hand.

export type HostedActionDecision = {
  [k: string]: unknown;
} & {
  decision: "select_route" | "leave_unchanged" | "deny";
  selectedOptionId?: string;
};
