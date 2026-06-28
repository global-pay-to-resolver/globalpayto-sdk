/* eslint-disable */
// Generated from packages/protocol/schemas/notification-event.schema.json. Do not edit by hand.

export interface NotificationEvent {
  eventType: "payment_intent_created";
  schema: "mypaytag.notification.v1";
  recipient: {
    identifierType: "paytag";
    maskedDisplay: string;
  };
  amount: {
    value: string;
    currency: string;
  };
  references: {
    resolverReference: string;
    providerReference: string;
    payingDappReference: string;
  };
  action: {
    type: "none";
  };
}
