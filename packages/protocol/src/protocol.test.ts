import { describe, expect, it } from "vitest";

import {
  validateGlobalPayToIntent,
  validateNotificationEvent,
  validateProviderResponse,
  validateResolveRequest,
  validateResolveResponse,
  validateRouteRegistrationRequest,
  validGlobalPayToIntent,
  validNoRouteResponse,
  validNotificationEvent,
  validProviderResponse,
  validResolveRequest,
  validResolvedResponse,
  validRouteRegistrationRequest,
  validRouteSelectionResponse,
} from "./index.js";

describe("@globalpayto/protocol", () => {
  it("accepts valid MVP fixtures", () => {
    expect(validateRouteRegistrationRequest(validRouteRegistrationRequest)).toEqual(
      validRouteRegistrationRequest,
    );
    expect(validateResolveRequest(validResolveRequest)).toEqual(validResolveRequest);
    expect(validateResolveResponse(validResolvedResponse)).toEqual(validResolvedResponse);
    expect(validateResolveResponse(validNoRouteResponse)).toEqual(validNoRouteResponse);
    expect(validateResolveResponse(validRouteSelectionResponse)).toEqual(
      validRouteSelectionResponse,
    );
    expect(validateProviderResponse(validProviderResponse)).toEqual(validProviderResponse);
    expect(validateGlobalPayToIntent(validGlobalPayToIntent)).toEqual(validGlobalPayToIntent);
    expect(validateNotificationEvent(validNotificationEvent)).toEqual(validNotificationEvent);
  });

  it("rejects route registration with address-like fields", () => {
    expect(() =>
      validateRouteRegistrationRequest({
        ...validRouteRegistrationRequest,
        address: "0xabc123",
      }),
    ).toThrow();
  });

  it("rejects paths that omit network", () => {
    expect(() =>
      validateResolveRequest({
        ...validResolveRequest,
        supportedPaths: [
          {
            chain: "base",
            asset: "USDC",
          },
        ],
      }),
    ).toThrow();
  });

  it("rejects malformed action URLs", () => {
    expect(() => {
      const invalidResponse = {
        ...validNoRouteResponse,
        action: {
          ...("action" in validNoRouteResponse ? validNoRouteResponse.action : {}),
          url: "not a uri",
        },
      };

      validateResolveResponse(invalidResponse);
    }).toThrow();
  });

  it("rejects provider payloads without typed destination fields", () => {
    expect(() =>
      validateProviderResponse({
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            destination: undefined,
          },
        },
      }),
    ).toThrow();
  });

  it("rejects old top-level provider recipient addresses", () => {
    expect(() =>
      validateProviderResponse({
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            recipientAddress: "0xabc123",
          },
        },
      }),
    ).toThrow();
  });

  it("rejects unsupported notification events", () => {
    expect(() =>
      validateNotificationEvent({
        ...validNotificationEvent,
        eventType: "payment_received",
      }),
    ).toThrow();
  });
});
