import {
  validMyPayTagIntent,
  validNoRouteResponse,
  validNotificationEvent,
  validProviderCallbackRequest,
  validProviderResponse,
  validResolvedResponse,
  validResolveRequest,
  validRouteRegistrationRequest,
  validRouteRegistrationResponse,
  validRouteSelectionResponse,
  type MyPayTagIntent,
  type NotificationEvent,
  type ProviderCallbackRequest,
  type ProviderResponse,
  type ResolveRequest,
  type ResolveResponse,
  type RouteQuotePreview,
  type RouteRegistrationRequest,
  type RouteRegistrationResponse,
  validateNotificationEvent,
  validateResolveRequest,
  validateRouteRegistrationRequest,
} from "@mypaytag/protocol";
import type {
  CryptoNativeExecutionSolverId,
  ExecutionQuote,
  ExecutionQuoteProvider,
  ExecutionQuoteRequest,
} from "@mypaytag/sdk";

export interface MyPayTagFixtures {
  paytags: {
    opaqueDefault: PaytagExampleFixture;
    rawExplicit: PaytagExampleFixture;
    availability: {
      available: PaytagAvailabilityFixture;
      unavailable: PaytagAvailabilityFixture;
      reserved: PaytagAvailabilityFixture;
      idempotentRetry: PaytagAvailabilityFixture;
      revokedReuseBlocked: PaytagAvailabilityFixture;
      expiredReuseBlocked: PaytagAvailabilityFixture;
    };
    negativeDisclosure: {
      noRoute: ResolveResponse;
      authorizationRequired: ResolveResponse;
      userActionRequired: ResolveResponse;
    };
  };
  routeRegistration: {
    valid: RouteRegistrationRequest;
    forbiddenAddress: RouteRegistrationRequest & { address: string };
    response: RouteRegistrationResponse;
  };
  resolve: {
    request: ResolveRequest;
    resolved: ResolveResponse;
    noRoute: ResolveResponse;
    routeSelectionRequired: ResolveResponse;
    invalidIdentifier: ResolveResponse;
    providerFailure: ResolveResponse;
  };
  provider: {
    callback: ProviderCallbackRequest;
    response: ProviderResponse;
  };
  notifications: {
    paymentIntentCreated: NotificationEvent;
  };
  routeOptions: {
    directTransfer: RouteQuotePreview;
    sameChainExchange: RouteQuotePreview;
    bridge: RouteQuotePreview;
    crossChainIntent: RouteQuotePreview;
    noRoute: ResolveResponse;
    routeSelectionRequired: ResolveResponse;
    providerUnavailable: ResolveResponse;
    insufficientBalance: ResolveResponse;
  };
  executionQuotes: {
    exactSendRequest: ExecutionQuoteRequest;
    exactReceiveRequest: ExecutionQuoteRequest;
    lifi: ExecutionQuote;
    squid: ExecutionQuote;
  };
  intent: MyPayTagIntent;
}

export interface PaytagExampleFixture {
  paytag: string;
  exposure: "opaque_default" | "raw_stamp_explicit";
  identityProvider: "cubid";
  userChoiceRequired: boolean;
}

export interface PaytagAvailabilityFixture {
  paytag: string;
  status:
    | "available"
    | "unavailable"
    | "reserved"
    | "idempotent_retry"
    | "revoked_reuse_blocked"
    | "expired_reuse_blocked";
  canIssue: boolean;
  publicReason?:
    | "already_taken"
    | "reserved_namespace"
    | "same_request_replay"
    | "revoked_recently"
    | "expired_recently";
}

export const myPayTagFixtures: MyPayTagFixtures = {
  paytags: {
    opaqueDefault: {
      paytag: "abd123@cubid.mypaytag",
      exposure: "opaque_default",
      identityProvider: "cubid",
      userChoiceRequired: false,
    },
    rawExplicit: {
      paytag: "+1234569999@phone.cubid.mypaytag",
      exposure: "raw_stamp_explicit",
      identityProvider: "cubid",
      userChoiceRequired: true,
    },
    availability: {
      available: {
        paytag: "new456@cubid.mypaytag",
        status: "available",
        canIssue: true,
      },
      unavailable: {
        paytag: "abd123@cubid.mypaytag",
        status: "unavailable",
        canIssue: false,
        publicReason: "already_taken",
      },
      reserved: {
        paytag: "support@mypaytag",
        status: "reserved",
        canIssue: false,
        publicReason: "reserved_namespace",
      },
      idempotentRetry: {
        paytag: "new456@cubid.mypaytag",
        status: "idempotent_retry",
        canIssue: true,
        publicReason: "same_request_replay",
      },
      revokedReuseBlocked: {
        paytag: "revoked789@cubid.mypaytag",
        status: "revoked_reuse_blocked",
        canIssue: false,
        publicReason: "revoked_recently",
      },
      expiredReuseBlocked: {
        paytag: "expired789@cubid.mypaytag",
        status: "expired_reuse_blocked",
        canIssue: false,
        publicReason: "expired_recently",
      },
    },
    negativeDisclosure: {
      noRoute: validNoRouteResponse,
      authorizationRequired: {
        status: "authorization_required",
      } satisfies ResolveResponse,
      userActionRequired: validRouteSelectionResponse,
    },
  },
  routeRegistration: {
    valid: validRouteRegistrationRequest,
    forbiddenAddress: {
      ...validRouteRegistrationRequest,
      address: "0xabc123",
    },
    response: validRouteRegistrationResponse,
  },
  resolve: {
    request: validResolveRequest,
    resolved: validResolvedResponse,
    noRoute: validNoRouteResponse,
    routeSelectionRequired: validRouteSelectionResponse,
    invalidIdentifier: {
      status: "invalid_identifier",
    } satisfies ResolveResponse,
    providerFailure: {
      status: "provider_unavailable",
    } satisfies ResolveResponse,
  },
  provider: {
    callback: validProviderCallbackRequest,
    response: validProviderResponse,
  },
  notifications: {
    paymentIntentCreated: validNotificationEvent,
  },
  routeOptions: {
    directTransfer: buildQuotePreview({
      id: "mpt_quote_direct",
      method: "direct_transfer",
      methodLabel: "Direct transfer",
      send: { chain: "eip155", network: "8453", asset: "USDC", amount: "25.00" },
      receive: { chain: "eip155", network: "8453", asset: "USDC", amount: "25.00" },
    }),
    sameChainExchange: buildQuotePreview({
      id: "mpt_quote_exchange",
      method: "provider_exchange",
      methodLabel: "Same-chain exchange",
      send: { chain: "eip155", network: "8453", asset: "ETH", amount: "0.008" },
      receive: { chain: "eip155", network: "8453", asset: "USDC", amount: "25.00" },
    }),
    bridge: buildQuotePreview({
      id: "mpt_quote_bridge",
      method: "bridge",
      methodLabel: "Bridge transfer",
      send: { chain: "eip155", network: "1", asset: "USDC", amount: "25.12" },
      receive: { chain: "eip155", network: "8453", asset: "USDC", amount: "25.00" },
    }),
    crossChainIntent: buildQuotePreview({
      id: "mpt_quote_cross_chain_intent",
      method: "cross_chain_intent",
      methodLabel: "Cross-chain intent",
      send: { chain: "solana", network: "mainnet-beta", asset: "USDC", amount: "25.18" },
      receive: { chain: "eip155", network: "8453", asset: "EURC", amount: "22.90" },
    }),
    noRoute: validNoRouteResponse,
    routeSelectionRequired: validRouteSelectionResponse,
    providerUnavailable: {
      status: "provider_unavailable",
    } satisfies ResolveResponse,
    insufficientBalance: {
      status: "invalid_request",
    } satisfies ResolveResponse,
  },
  executionQuotes: {
    exactSendRequest: {
      amount: { value: "25.00", currency: "USDC" },
      sourceAsset: "eip155:1/erc20:0x...",
      destinationAsset: "eip155:8453/erc20:0x...",
      recipient: "eip155:8453:0x0000000000000000000000000000000000000001",
      reference: "example-payor:exact-send",
    },
    exactReceiveRequest: {
      amount: { value: "25.00", currency: "USDC" },
      sourceAsset: "solana:mainnet-beta/spl-token:...",
      destinationAsset: "eip155:8453/erc20:0x...",
      recipient: "eip155:8453:0x0000000000000000000000000000000000000001",
      reference: "example-payor:exact-receive",
    },
    lifi: {
      solverId: "lifi",
      quoteId: "quote_lifi_fixture",
      sendAmount: "25.24",
      receiveAmount: "25.00",
      estimatedDurationSeconds: 45,
      transactionRequest: {
        to: "0x0000000000000000000000000000000000000001",
        data: "0x",
      },
    },
    squid: {
      solverId: "squid",
      quoteId: "quote_squid_fixture",
      sendAmount: "25.22",
      receiveAmount: "25.00",
      estimatedDurationSeconds: 60,
    },
  },
  intent: validMyPayTagIntent,
};

export interface MockPaytagValidator {
  validatePaytag(identifier: string): Promise<{
    paytagReference: string;
    hash: string;
    maskedDisplay: string;
    valid: boolean;
  }>;
}

export function createMockPaytagValidator(): MockPaytagValidator {
  return {
    async validatePaytag(identifier: string) {
      return {
        paytagReference: "paytag_ref_abc",
        hash: `sha256:${identifier}`,
        maskedDisplay: "a***@cubid.mypaytag",
        valid: identifier.length > 0,
      };
    },
  };
}

export interface MockResolver {
  resolve(request: ResolveRequest): Promise<ResolveResponse>;
  registerRoute(request: RouteRegistrationRequest): Promise<RouteRegistrationResponse>;
}

export function createMockResolver(response: ResolveResponse = validResolvedResponse): MockResolver {
  return {
    async resolve(request) {
      validateResolveRequest(request);
      return response;
    },
    async registerRoute(request) {
      validateRouteRegistrationRequest(request);
      return validRouteRegistrationResponse;
    },
  };
}

export interface MockPayToDapp {
  createPaymentIntent(request: ProviderCallbackRequest): Promise<ProviderResponse>;
}

export function createMockPayToDapp(response: ProviderResponse = validProviderResponse): MockPayToDapp {
  return {
    async createPaymentIntent() {
      return response;
    },
  };
}

export function createPaymentIntentCreatedNotification(
  overrides: Partial<NotificationEvent> = {},
): NotificationEvent {
  return validateNotificationEvent({
    ...validNotificationEvent,
    ...overrides,
  });
}

export function createMockExecutionQuoteProvider({
  solverId,
  quote = defaultQuoteForSolver(solverId),
  failWith,
}: {
  solverId: CryptoNativeExecutionSolverId;
  quote?: ExecutionQuote;
  failWith?: "provider_unavailable" | "insufficient_balance";
}): ExecutionQuoteProvider {
  return {
    solverId,
    async requestQuote(request: ExecutionQuoteRequest) {
      if (failWith) {
        throw new Error(failWith);
      }

      return {
        ...quote,
        solverId,
        expiresAt: quote.expiresAt ?? request.expiresAt,
      };
    },
  };
}

function buildQuotePreview(input: Omit<RouteQuotePreview, "fees" | "expiresAt" | "resolverReference">): RouteQuotePreview {
  return {
    ...input,
    fees: [
      {
        label: "Provider cost",
        amount: "0.10",
        asset: input.receive.asset,
        chargedTo: "sender",
        source: "provider",
      },
      {
        label: "Payor app fee",
        amount: "0.02",
        asset: input.receive.asset,
        chargedTo: "sender",
        source: "payor_app",
      },
    ],
    expiresAt: "2026-06-24T20:00:00Z",
    resolverReference: "mpt_req_fixture",
  };
}

function defaultQuoteForSolver(solverId: CryptoNativeExecutionSolverId): ExecutionQuote {
  return {
    solverId,
    quoteId: `quote_${solverId}_fixture`,
    sendAmount: "25.15",
    receiveAmount: "25.00",
  };
}
