import type {
  HostedActionCompletion,
  HostedActionDecision,
  HostedActionView,
  MyPayTagIntent,
  NearOneClickPayableInstruction,
  NearOneClickQuoteOption,
  NearOneClickQuoteSelectionRequest,
  NotificationEvent,
  PayToRoute,
  ProviderCallbackRequest,
  ProviderResponse,
  RouteDeleteResponse,
  RouteListResponse,
  RouteQuotePreview,
  RouteReadResponse,
  ResolveRequest,
  ResolveResponse,
  RouteRegistrationRequest,
  RouteRegistrationResponse,
  RouteUpdateRequest,
} from "./generated/types.js";

export const validRouteRegistrationRequest: RouteRegistrationRequest = {
  recipient: {
    identifierType: "paytag",
    identifier: "abd123@cubid.mypaytag",
  },
  payToDappId: "smartrust-wallet",
  supportedRoutes: [
    {
      chain: "base",
      network: "mainnet",
      asset: "USDC",
    },
  ],
  authorizationToken: "mpt_auth_123",
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

export const validPayToRoute: PayToRoute = {
  id: "mpt_route_123",
  payToDappId: "smartrust-wallet",
  chain: "base",
  network: "mainnet",
  asset: "USDC",
  state: "active",
};

export const validRouteListResponse: RouteListResponse = {
  status: "resolved",
  routes: [validPayToRoute],
};

export const validRouteReadResponse: RouteReadResponse = {
  status: "resolved",
  route: validPayToRoute,
};

export const validRouteUpdateRequest: RouteUpdateRequest = {
  state: "disabled",
};

export const validRouteDeleteResponse: RouteDeleteResponse = {
  status: "revoked",
  routeId: validPayToRoute.id,
};

export const validRouteNotFoundResponse: RouteReadResponse = {
  status: "no_route",
};

export const validRouteUnavailableResponse: RouteDeleteResponse = {
  status: "provider_unavailable",
};

export const validHostedActionView: HostedActionView = {
  status: "ready",
  actionId: "mpt_act_789",
  actionType: "route_selection",
  expiresAt: "2026-06-24T20:00:00Z",
  options: [
    {
      optionId: "mpt_route_option_123",
      chain: "base",
      network: "mainnet",
      asset: "USDC",
      payToDappId: "smartrust-wallet",
      displayName: "SmarTrust Wallet - Base USDC",
    },
  ],
};

export const expiredHostedActionView: HostedActionView = {
  status: "expired",
  actionId: "mpt_act_expired",
  actionType: "route_selection",
};

export const replayedHostedActionCompletion: HostedActionCompletion = {
  status: "replayed",
  actionId: "mpt_act_replayed",
};

export const restartRequiredHostedActionCompletion: HostedActionCompletion = {
  status: "restart_required",
  actionId: "mpt_act_restart",
};

export const validHostedActionDecision: HostedActionDecision = {
  decision: "select_route",
  selectedOptionId: "mpt_route_option_123",
};

export const denyHostedActionDecision: HostedActionDecision = {
  decision: "deny",
};

export const validHostedActionCompletion: HostedActionCompletion = {
  status: "selected_route",
  actionId: "mpt_act_789",
  selectedOptionId: "mpt_route_option_123",
};

export const validResolveRequest: ResolveRequest = {
  recipient: {
    identifierType: "paytag",
    identifier: "abd123@cubid.mypaytag",
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
    identifierType: "paytag",
    paytagReference: "paytag_ref_abc",
  },
  payingDappId: "chaincrew",
  payingDappReference: "chaincrew:payout_987",
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
      resolverReference: "mpt_req_123",
      payingDappId: "chaincrew",
      payingDappReference: "chaincrew:payout_987",
      chain: "base",
      network: "mainnet",
      asset: "USDC",
      destination: {
        kind: "blockchain_address",
        recipientAddress: "0xabc123",
      },
      amount: "25.00",
      purpose: "payout",
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
    identifierType: "paytag",
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
    identifierType: "paytag",
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

export const validNearOneClickQuoteOption: NearOneClickQuoteOption = {
  schema: "mypaytag.near_1click.quote_option.v1",
  quoteId: "near_1click_quote_123",
  adapter: "near_intents_1click",
  send: {
    chain: "near",
    network: "mainnet",
    asset: "USDC",
    amount: "25.18",
  },
  receive: {
    chain: "base",
    network: "mainnet",
    asset: "USDC",
    amount: "25.00",
  },
  fees: [
    {
      label: "NEAR 1Click execution",
      amount: "0.16",
      asset: "USDC",
      chargedTo: "sender",
      source: "near_1click",
    },
    {
      label: "MyPayTag resolver fee",
      amount: "0.02",
      asset: "USDC",
      chargedTo: "sender",
      source: "resolver",
    },
  ],
  expiresAt: "2026-06-24T20:00:00Z",
  resolverReference: "mpt_req_123",
  selectedRouteReference: "mpt_route_123",
  nearQuoteReference: "near_quote_ref_123",
  estimatedDurationSeconds: 20,
};

export const validNearOneClickQuoteSelectionRequest: NearOneClickQuoteSelectionRequest = {
  schema: "mypaytag.near_1click.quote_selection_request.v1",
  resolverReference: validNearOneClickQuoteOption.resolverReference,
  quoteId: validNearOneClickQuoteOption.quoteId,
  selectedRouteReference: validNearOneClickQuoteOption.selectedRouteReference,
  payingDappReference: validResolveRequest.payingDappReference,
  idempotencyKey: "mpt_idem_near_123",
  clientReference: "chaincrew:near_selection_123",
};

export const validNearOneClickPayableInstruction: NearOneClickPayableInstruction = {
  schema: "mypaytag.near_1click.payable_instruction.v1",
  status: "ready",
  adapter: "near_intents_1click",
  resolverReference: validNearOneClickQuoteOption.resolverReference,
  quoteId: validNearOneClickQuoteOption.quoteId,
  selectedRouteReference: validNearOneClickQuoteOption.selectedRouteReference,
  payingDappReference: validResolveRequest.payingDappReference,
  expiresAt: validNearOneClickQuoteOption.expiresAt,
  instruction: {
    kind: "near_1click_payable",
    payload: {
      nearQuoteReference: "near_quote_ref_123",
      depositAddress: "near1click-deposit.testnet",
      depositAsset: "USDC",
      depositAmount: "25.18",
      recipientAsset: "USDC",
      recipientAmount: "25.00",
      deadline: validNearOneClickQuoteOption.expiresAt,
    },
  },
};
