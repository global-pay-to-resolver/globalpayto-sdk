import { describe, expect, it } from "vitest";

import {
  validateGlobalPayToIntent,
  validateNotificationEvent,
  validateProviderResponse,
  validateResolveRequest,
  validateResolveResponse,
  validateRouteRegistrationRequest,
  validateStatus,
  validGlobalPayToIntent,
  validNoRouteResponse,
  validNotificationEvent,
  validProviderResponse,
  validResolveRequest,
  validResolvedResponse,
  validRouteRegistrationRequest,
  validRouteSelectionResponse,
} from "./index.js";

const terminalStatusFixtures = [
  "unsupported_path",
  "provider_unavailable",
  "provider_error",
  "expired_authorization",
  "revoked_authorization",
  "invalid_identifier",
  "invalid_request",
] as const;

const actionStatusFixtures = [
  {
    status: "no_route",
    action: {
      type: "setup",
      url: "https://globalpayto.example/actions/setup/gptr_act_456",
      expiresAt: "2026-06-24T20:00:00Z",
    },
  },
  {
    status: "authorization_required",
    action: {
      type: "authorization",
      url: "https://globalpayto.example/actions/setup/gptr_act_auth",
      expiresAt: "2026-06-24T20:00:00Z",
    },
  },
  validRouteSelectionResponse,
] as const;

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

  it("accepts every public status value and response shape", () => {
    expect(validateStatus("resolved")).toBe("resolved");
    for (const response of actionStatusFixtures) {
      expect(validateStatus(response.status)).toBe(response.status);
      expect(validateResolveResponse(response)).toEqual(response);
    }
    for (const status of terminalStatusFixtures) {
      const response = { status };

      expect(validateStatus(status)).toBe(status);
      expect(validateResolveResponse(response)).toEqual(response);
    }
  });

  it("rejects route registration with forbidden payment instruction fields", () => {
    for (const [field, value] of [
      ["account", "acct_123"],
      ["address", "0xabc123"],
      ["recipientAddress", "0xabc123"],
      ["memo", "do not include provider memo"],
      ["paymentInstruction", validProviderResponse.paymentInstruction],
      ["paymentLink", "https://provider.example/pay"],
    ] as const) {
      expect(() =>
        validateRouteRegistrationRequest({
          ...validRouteRegistrationRequest,
          [field]: value,
        }),
      ).toThrow();
    }
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

  it("rejects action statuses without action URLs", () => {
    expect(() =>
      validateResolveResponse({
        status: "authorization_required",
      }),
    ).toThrow();
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

  it("rejects provider payloads that expose address-like fields inside GlobalPayTo intents", () => {
    for (const field of ["recipientAddress", "address", "account"] as const) {
      expect(() =>
        validateResolveResponse({
          ...validResolvedResponse,
          intent: {
            ...validGlobalPayToIntent,
            paymentInstruction: {
              ...validGlobalPayToIntent.paymentInstruction,
              payload: {
                ...validGlobalPayToIntent.paymentInstruction.payload,
                [field]: "0xabc123",
              },
            },
          },
        }),
      ).toThrow();
    }
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

  it("rejects notification payloads with provider receipt or action-link fields", () => {
    expect(() =>
      validateNotificationEvent({
        ...validNotificationEvent,
        action: {
          type: "setup",
          url: "https://globalpayto.example/actions/setup/gptr_act_456",
          expiresAt: "2026-06-24T20:00:00Z",
        },
      }),
    ).toThrow();
    expect(() =>
      validateNotificationEvent({
        ...validNotificationEvent,
        references: {
          ...validNotificationEvent.references,
          receiptReference: "provider_receipt_123",
        },
      }),
    ).toThrow();
  });
});
