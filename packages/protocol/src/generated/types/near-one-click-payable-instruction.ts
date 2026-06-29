/* eslint-disable */
// Generated from packages/protocol/schemas/near-one-click-payable-instruction.schema.json. Do not edit by hand.

export interface NearOneClickPayableInstruction {
  schema: "mypaytag.near_1click.payable_instruction.v1";
  status: "ready";
  adapter: "near_intents_1click";
  resolverReference: string;
  quoteId: string;
  selectedRouteReference: string;
  payingDappReference: string;
  expiresAt: string;
  instruction: {
    kind: "near_1click_payable";
    payload: {
      nearQuoteReference: string;
      depositAddress: string;
      depositAsset: string;
      depositAmount: string;
      recipientAsset: string;
      recipientAmount: string;
      deadline: string;
    };
  };
}
