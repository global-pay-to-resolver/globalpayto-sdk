import type {
  GlobalPayToIntent,
  NotificationEvent,
  ProviderCallbackRequest,
  ProviderResponse,
  ResolveRequest,
  ResolveResponse,
  RouteRegistrationRequest,
  RouteRegistrationResponse,
} from "./generated/types.js";

export const validRouteRegistrationRequest: RouteRegistrationRequest = {
  recipient: {
    identifierType: "verified_stamp",
    identifier: "email:noak@example.com",
  },
  payToDappId: "smartrust-wallet",
  supportedRoutes: [
    {
      chain: "base",
      network: "mainnet",
      asset: "USDC",
    },
  ],
  consentToken: "cubid_consent_token",
};

export const validRouteRegistrationResponse: RouteRegistrationResponse = {
  status: "resolved",
  routes: [
    {
      id: "gptr_route_123",
      payToDappId: "smartrust-wallet",
      chain: "base",
      network: "mainnet",
      asset: "USDC",
      state: "active",
    },
  ],
};

export const validResolveRequest: ResolveRequest = {
  recipient: {
    identifierType: "verified_stamp",
    identifier: "email:noak@example.com",
  },
  supportedPaths: [
    {
      chain: "base",
      network: "mainnet",
      asset: "USDC",
    },
  ],
  amount: {
    value: "25.00",
    currency: "USDC",
  },
  purpose: "payout",
  intentMode: "one_time",
  payingDappReference: "chaincrew:payout_987",
};

export const validProviderCallbackRequest: ProviderCallbackRequest = {
  resolverRequestId: "gptr_req_123",
  recipient: {
    identifierType: "verified_stamp",
    identifierAlias: "cubid_stamp_alias_abc",
  },
  payingDappId: "chaincrew",
  selectedPath: {
    chain: "base",
    network: "mainnet",
    asset: "USDC",
  },
  amount: {
    value: "25.00",
    currency: "USDC",
  },
  purpose: "payout",
  expiresAt: "2026-06-24T20:00:00Z",
};

export const validProviderResponse: ProviderResponse = {
  providerIntentId: "st_pi_456",
  status: "ready",
  paymentInstruction: {
    type: "provider_json",
    provider: "smartrust-wallet",
    payload: {
      providerIntentId: "st_pi_456",
      chain: "base",
      network: "mainnet",
      asset: "USDC",
      recipientAddress: "0xabc123",
      amount: "25.00",
      reference: "smartrust:st_pi_456",
      expiresAt: "2026-06-24T20:00:00Z",
    },
  },
};

export const validGlobalPayToIntent: GlobalPayToIntent = {
  id: "gptr_pi_123",
  schema: "globalpayto.intent.v1",
  status: "ready",
  modality: "provider_intent",
  recipient: {
    identifierType: "verified_stamp",
    identifierHash: "sha256:example",
  },
  selectedRoute: {
    payToDappId: "smartrust-wallet",
    chain: "base",
    network: "mainnet",
    asset: "USDC",
  },
  amount: {
    value: "25.00",
    currency: "USDC",
  },
  expiresAt: "2026-06-24T20:00:00Z",
  singleUse: true,
  paymentInstruction: validProviderResponse.paymentInstruction,
  references: {
    resolverReference: "gptr_pi_123",
    providerReference: "st_pi_456",
    payingDappReference: "chaincrew:payout_987",
  },
};

export const validResolvedResponse: ResolveResponse = {
  status: "resolved",
  intent: validGlobalPayToIntent,
};

export const validNoRouteResponse: ResolveResponse = {
  status: "no_route",
  action: {
    type: "setup",
    url: "https://globalpayto.example/actions/setup/gptr_act_456",
    expiresAt: "2026-06-24T20:00:00Z",
  },
};

export const validRouteSelectionResponse: ResolveResponse = {
  status: "user_action_required",
  action: {
    type: "route_selection",
    url: "https://globalpayto.example/actions/route-selection/gptr_act_789",
    expiresAt: "2026-06-24T20:00:00Z",
  },
};

export const validNotificationEvent: NotificationEvent = {
  eventType: "payment_intent_created",
  schema: "globalpayto.notification.v1",
  recipient: {
    identifierType: "verified_stamp",
    maskedDisplay: "n***@example.com",
  },
  amount: {
    value: "25.00",
    currency: "USDC",
  },
  references: {
    resolverReference: "gptr_pi_123",
    providerReference: "st_pi_456",
    payingDappReference: "chaincrew:payout_987",
  },
  action: {
    type: "none",
  },
};
