/* eslint-disable */
// Generated from packages/protocol/schemas/notification-event.schema.json. Do not edit by hand.

export interface NotificationEvent {
  eventType: "payment_intent_created";
  schema: "globalpayto.notification.v1";
  recipient: {
    identifierType: "verified_stamp";
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
