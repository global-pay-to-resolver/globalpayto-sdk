import type {
  MyPayTagIntent,
  NotificationEvent,
  ProviderCallbackRequest,
  ProviderResponse,
  RouteQuotePreview,
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
      id: "mpt_route_123",
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
  resolverRequestId: "mpt_req_123",
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
      destination: {
        kind: "blockchain_address",
        recipientAddress: "0xabc123",
      },
      amount: "25.00",
      reference: "smartrust:st_pi_456",
      expiresAt: "2026-06-24T20:00:00Z",
    },
  },
};

export const validMyPayTagIntent: MyPayTagIntent = {
  id: "mpt_pi_123",
  schema: "mypaytag.intent.v1",
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
    resolverReference: "mpt_pi_123",
    providerReference: "st_pi_456",
    payingDappReference: "chaincrew:payout_987",
  },
};

export const validResolvedResponse: ResolveResponse = {
  status: "resolved",
  intent: validMyPayTagIntent,
};

export const validNoRouteResponse: ResolveResponse = {
  status: "no_route",
};

export const validRouteSelectionResponse: ResolveResponse = {
  status: "user_action_required",
  action: {
    type: "route_selection",
    url: "https://mypaytag.com/actions/route-selection/mpt_act_789",
    expiresAt: "2026-06-24T20:00:00Z",
  },
};

export const validNotificationEvent: NotificationEvent = {
  eventType: "payment_intent_created",
  schema: "mypaytag.notification.v1",
  recipient: {
    identifierType: "verified_stamp",
    maskedDisplay: "n***@example.com",
  },
  amount: {
    value: "25.00",
    currency: "USDC",
  },
  references: {
    resolverReference: "mpt_pi_123",
    providerReference: "st_pi_456",
    payingDappReference: "chaincrew:payout_987",
  },
  action: {
    type: "none",
  },
};

export const validRouteQuotePreview: RouteQuotePreview = {
  id: "mpt_quote_123",
  method: "cross_chain_intent",
  methodLabel: "Cross-chain intent route",
  send: {
    chain: "eip155",
    network: "1",
    asset: "USDC",
    amount: "25.25",
  },
  receive: {
    chain: "eip155",
    network: "8453",
    asset: "USDC",
    amount: "25.00",
  },
  fees: [
    {
      label: "Provider cost",
      amount: "0.20",
      asset: "USDC",
      chargedTo: "sender",
      source: "provider",
    },
    {
      label: "Payor app fee",
      amount: "0.05",
      asset: "USDC",
      chargedTo: "sender",
      source: "payor_app",
    },
  ],
  expiresAt: "2026-06-24T20:00:00Z",
  resolverReference: "mpt_req_123",
};
