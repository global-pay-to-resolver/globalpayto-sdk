/* eslint-disable */
// Generated from packages/protocol/schemas/route-quote-preview.schema.json. Do not edit by hand.

export interface RouteQuotePreview {
  id: string;
  method: "direct_transfer" | "provider_exchange" | "provider_intent" | "bridge" | "cross_chain_intent";
  methodLabel: string;
  send: RouteAmount;
  receive: RouteAmount;
  fees: Fee[];
  expiresAt: string;
  resolverReference: string;
}
export interface RouteAmount {
  chain: string;
  network: string;
  asset: string;
  amount: string;
}
export interface Fee {
  label: string;
  amount: string;
  asset: string;
  chargedTo: "sender";
  source: "payor_app" | "provider" | "resolver";
}
