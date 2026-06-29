/* eslint-disable */
// Generated from packages/protocol/schemas/near-one-click-quote-option.schema.json. Do not edit by hand.

export interface NearOneClickQuoteOption {
  schema: "mypaytag.near_1click.quote_option.v1";
  quoteId: string;
  adapter: "near_intents_1click";
  send: RouteAmount;
  receive: RouteAmount;
  fees: Fee[];
  expiresAt: string;
  resolverReference: string;
  selectedRouteReference: string;
  nearQuoteReference?: string;
  estimatedDurationSeconds?: number;
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
  source: "near_1click" | "resolver" | "paying_dapp";
}
