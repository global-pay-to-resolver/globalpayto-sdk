/* eslint-disable */
// Generated from packages/protocol/schemas/resolve-response.schema.json. Do not edit by hand.

export type ResolveResponse =
  | {
      status: "resolved";
      intent: Intent;
    }
  | {
      status: "no_route" | "user_action_required" | "authorization_required";
      action: Action;
    }
  | {
      status:
        | "unsupported_path"
        | "provider_unavailable"
        | "provider_error"
        | "expired_authorization"
        | "revoked_authorization"
        | "invalid_identifier"
        | "invalid_request";
    };

export interface Intent {
  id: string;
  schema: "globalpayto.intent.v1";
  status: "ready";
  modality: "provider_intent";
  recipient: {
    identifierType: "verified_stamp";
    identifierHash: string;
  };
  selectedRoute: SelectedRoute;
  amount: Amount;
  expiresAt: string;
  singleUse: true;
  paymentInstruction: PaymentInstruction;
  references: References;
}
export interface SelectedRoute {
  payToDappId: string;
  chain: string;
  network: string;
  asset: string;
}
export interface Amount {
  value: string;
  currency: string;
}
export interface PaymentInstruction {
  type: "provider_json";
  provider: string;
  payload: ProviderPayload;
}
export interface ProviderPayload {
  providerIntentId: string;
  chain: string;
  network: string;
  asset: string;
  recipientAddress: string;
  amount: string;
  reference: string;
  expiresAt: string;
  [k: string]: unknown;
}
export interface References {
  resolverReference: string;
  providerReference: string;
  payingDappReference: string;
}
export interface Action {
  type: "setup" | "authorization" | "route_selection";
  url: string;
  expiresAt: string;
}
