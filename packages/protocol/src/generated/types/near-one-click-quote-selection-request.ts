/* eslint-disable */
// Generated from packages/protocol/schemas/near-one-click-quote-selection-request.schema.json. Do not edit by hand.

export interface NearOneClickQuoteSelectionRequest {
  schema: "mypaytag.near_1click.quote_selection_request.v1";
  resolverReference: string;
  quoteId: string;
  selectedRouteReference: string;
  payingDappReference: string;
  idempotencyKey: string;
  clientReference?: string;
}
