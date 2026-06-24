import {
  validGlobalPayToIntent,
  validNoRouteResponse,
  validNotificationEvent,
  validProviderCallbackRequest,
  validProviderResponse,
  validResolvedResponse,
  validResolveRequest,
  validRouteRegistrationRequest,
  validRouteRegistrationResponse,
  validRouteSelectionResponse,
  type GlobalPayToIntent,
  type NotificationEvent,
  type ProviderCallbackRequest,
  type ProviderResponse,
  type ResolveRequest,
  type ResolveResponse,
  type RouteRegistrationRequest,
  type RouteRegistrationResponse,
  validateNotificationEvent,
  validateResolveRequest,
  validateRouteRegistrationRequest,
} from "@globalpayto/protocol";

export interface GlobalPayToFixtures {
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
  intent: GlobalPayToIntent;
}

export const globalPayToFixtures: GlobalPayToFixtures = {
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
  intent: validGlobalPayToIntent,
};

export interface MockCubidValidator {
  validateStamp(identifier: string): Promise<{
    alias: string;
    hash: string;
    maskedDisplay: string;
    valid: boolean;
  }>;
}

export function createMockCubidValidator(): MockCubidValidator {
  return {
    async validateStamp(identifier: string) {
      return {
        alias: "cubid_stamp_alias_abc",
        hash: `sha256:${identifier}`,
        maskedDisplay: "n***@example.com",
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
