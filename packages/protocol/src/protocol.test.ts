import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import { parse as parseYaml } from "yaml";

import {
  validateMyPayTagIntent,
  validateNearOneClickPayableInstruction,
  validateNotificationEvent,
  validateNearOneClickQuoteOption,
  validateNearOneClickQuoteSelectionRequest,
  validatePayToRoute,
  validateProviderCallbackRequest,
  validateProviderResponse,
  validateRouteDeleteResponse,
  validateRouteListResponse,
  validateResolveRequest,
  validateResolveResponse,
  validateRouteRegistrationRequest,
  validateRouteRegistrationResponse,
  validateRouteReadResponse,
  validateRouteQuotePreview,
  validateRouteUpdateRequest,
  validateStatus,
  validMyPayTagIntent,
  validNearOneClickPayableInstruction,
  validNoRouteResponse,
  validNotificationEvent,
  validNearOneClickQuoteOption,
  validNearOneClickQuoteSelectionRequest,
  validProviderCallbackRequest,
  validProviderResponse,
  validPayToRoute,
  validRouteDeleteResponse,
  validRouteListResponse,
  validRouteNotFoundResponse,
  validResolveRequest,
  validResolvedResponse,
  validRouteRegistrationRequest,
  validRouteQuotePreview,
  validRouteReadResponse,
  validRouteSelectionResponse,
  validRouteUnavailableResponse,
  validRouteUpdateRequest,
} from "./index.js";

const terminalStatusFixtures = [
  "no_route",
  "authorization_required",
  "unsupported_path",
  "provider_unavailable",
  "provider_error",
  "expired_authorization",
  "revoked_authorization",
  "invalid_identifier",
  "invalid_request",
] as const;

const actionStatusFixtures = [
  validRouteSelectionResponse,
] as const;

const providerPayloadRequiredFields = [
  "providerIntentId",
  "resolverReference",
  "payingDappId",
  "payingDappReference",
  "chain",
  "network",
  "asset",
  "destination",
  "amount",
  "purpose",
  "reference",
  "expiresAt",
] as const;

const providerCallbackRequiredFields = [
  "resolverRequestId",
  "recipient",
  "payingDappId",
  "payingDappReference",
  "selectedPath",
  "amount",
  "purpose",
  "expiresAt",
] as const;

describe("@mypaytag/protocol", () => {
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
    expect(validatePayToRoute(validPayToRoute)).toEqual(validPayToRoute);
    expect(validateRouteListResponse(validRouteListResponse)).toEqual(validRouteListResponse);
    expect(validateRouteReadResponse(validRouteReadResponse)).toEqual(validRouteReadResponse);
    expect(validateRouteUpdateRequest(validRouteUpdateRequest)).toEqual(validRouteUpdateRequest);
    expect(validateRouteDeleteResponse(validRouteDeleteResponse)).toEqual(validRouteDeleteResponse);
    expect(validateProviderResponse(validProviderResponse)).toEqual(validProviderResponse);
    expect(validateMyPayTagIntent(validMyPayTagIntent)).toEqual(validMyPayTagIntent);
    expect(validateNotificationEvent(validNotificationEvent)).toEqual(validNotificationEvent);
    expect(validateRouteQuotePreview(validRouteQuotePreview)).toEqual(validRouteQuotePreview);
    expect(validateNearOneClickQuoteOption(validNearOneClickQuoteOption)).toEqual(
      validNearOneClickQuoteOption,
    );
    expect(validateNearOneClickQuoteSelectionRequest(validNearOneClickQuoteSelectionRequest)).toEqual(
      validNearOneClickQuoteSelectionRequest,
    );
    expect(validateNearOneClickPayableInstruction(validNearOneClickPayableInstruction)).toEqual(
      validNearOneClickPayableInstruction,
    );
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

  it("accepts route CRUD response and safe unavailable shapes", () => {
    expect(validateRouteListResponse(validRouteListResponse)).toEqual(validRouteListResponse);
    expect(validateRouteReadResponse(validRouteReadResponse)).toEqual(validRouteReadResponse);
    expect(validateRouteReadResponse(validRouteNotFoundResponse)).toEqual(validRouteNotFoundResponse);
    expect(validateRouteDeleteResponse(validRouteDeleteResponse)).toEqual(validRouteDeleteResponse);
    expect(validateRouteDeleteResponse(validRouteUnavailableResponse)).toEqual(
      validRouteUnavailableResponse,
    );
  });

  it("rejects route CRUD payloads that expose private route or wallet data", () => {
    for (const [field, value] of [
      ["account", "acct_123"],
      ["address", "0xabc123"],
      ["recipientAddress", "0xabc123"],
      ["paymentInstruction", validProviderResponse.paymentInstruction],
      ["routePreference", "default"],
      ["walletGraph", { connectedWallets: ["0xabc123"] }],
    ] as const) {
      expect(() =>
        validatePayToRoute({
          ...validPayToRoute,
          [field]: value,
        }),
      ).toThrow();

      expect(() =>
        validateRouteUpdateRequest({
          ...validRouteUpdateRequest,
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
        ...validRouteSelectionResponse,
        action: {
          ...validRouteSelectionResponse.action,
          url: "not a uri",
        },
      };

      validateResolveResponse(invalidResponse);
    }).toThrow();
  });

  it("rejects route-selection statuses without action URLs", () => {
    expect(() =>
      validateResolveResponse({
        status: "user_action_required",
      }),
    ).toThrow();
  });

  it("rejects setup or authorization action links on resolve responses", () => {
    for (const action of [
      {
        type: "setup",
        url: "https://mypaytag.com/actions/setup/mpt_act_456",
        expiresAt: "2026-06-24T20:00:00Z",
      },
      {
        type: "authorization",
        url: "https://mypaytag.com/actions/setup/mpt_act_auth",
        expiresAt: "2026-06-24T20:00:00Z",
      },
    ] as const) {
      expect(() =>
        validateResolveResponse({
          status: "user_action_required",
          action,
        }),
      ).toThrow();
    }
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

  it("rejects provider responses missing required provider_json payload fields", () => {
    for (const field of providerPayloadRequiredFields) {
      const payload = { ...validProviderResponse.paymentInstruction.payload };
      delete payload[field];

      expect(() =>
        validateProviderResponse({
          ...validProviderResponse,
          paymentInstruction: {
            ...validProviderResponse.paymentInstruction,
            payload,
          },
        }),
      ).toThrow();
    }
  });

  it("rejects provider callbacks missing binding fields", () => {
    for (const field of providerCallbackRequiredFields) {
      const callback = { ...validProviderCallbackRequest };
      delete callback[field];

      expect(() => validateProviderCallbackRequest(callback)).toThrow();
    }
  });

  it("rejects provider payloads that expose address-like fields inside MyPayTag intents", () => {
    for (const field of ["recipientAddress", "address", "account"] as const) {
      expect(() =>
        validateResolveResponse({
          ...validResolvedResponse,
          intent: {
            ...validMyPayTagIntent,
            paymentInstruction: {
              ...validMyPayTagIntent.paymentInstruction,
              payload: {
                ...validMyPayTagIntent.paymentInstruction.payload,
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

  it("rejects quote previews that expose recipient inventory or charge receiver fees", () => {
    expect(() =>
      validateRouteQuotePreview({
        ...validRouteQuotePreview,
        payToDappOptions: ["smartrust-wallet", "other-wallet"],
      }),
    ).toThrow();

    expect(() =>
      validateRouteQuotePreview({
        ...validRouteQuotePreview,
        fees: [
          {
            ...validRouteQuotePreview.fees[0],
            chargedTo: "receiver",
          },
        ],
      }),
    ).toThrow();
  });

  it("treats NEAR 1Click quote options as the only MVP execution quote contract", () => {
    expect(() =>
      validateNearOneClickQuoteOption({
        ...validNearOneClickQuoteOption,
        adapter: "lifi",
      }),
    ).toThrow();

    expect(() =>
      validateNearOneClickQuoteOption({
        ...validNearOneClickQuoteOption,
        payToDappOptions: ["smartrust-wallet", "other-wallet"],
      }),
    ).toThrow();

    expect(() =>
      validateNearOneClickQuoteOption({
        ...validNearOneClickQuoteOption,
        fees: [
          {
            ...validNearOneClickQuoteOption.fees[0],
            chargedTo: "receiver",
          },
        ],
      }),
    ).toThrow();
  });

  it("accepts selected NEAR 1Click quotes and payable instructions", () => {
    expect(validateNearOneClickQuoteSelectionRequest(validNearOneClickQuoteSelectionRequest)).toEqual(
      validNearOneClickQuoteSelectionRequest,
    );
    expect(validateNearOneClickPayableInstruction(validNearOneClickPayableInstruction)).toEqual(
      validNearOneClickPayableInstruction,
    );
  });

  it("rejects unsafe NEAR 1Click quote selection and payable instruction payloads", () => {
    expect(() =>
      validateNearOneClickQuoteSelectionRequest({
        ...validNearOneClickQuoteSelectionRequest,
        idempotencyKey: "short",
      }),
    ).toThrow();

    expect(() =>
      validateNearOneClickQuoteSelectionRequest({
        ...validNearOneClickQuoteSelectionRequest,
        selectedRouteReference: "",
      }),
    ).toThrow();

    expect(() =>
      validateNearOneClickPayableInstruction({
        ...validNearOneClickPayableInstruction,
        adapter: "lifi",
      }),
    ).toThrow();

    expect(() =>
      validateNearOneClickPayableInstruction({
        ...validNearOneClickPayableInstruction,
        instruction: {
          ...validNearOneClickPayableInstruction.instruction,
          payload: {
            ...validNearOneClickPayableInstruction.instruction.payload,
            depositAmount: "twenty five",
          },
        },
      }),
    ).toThrow();

    expect(() =>
      validateNearOneClickPayableInstruction({
        ...validNearOneClickPayableInstruction,
        instruction: {
          ...validNearOneClickPayableInstruction.instruction,
          payload: {
            ...validNearOneClickPayableInstruction.instruction.payload,
            payToDappOptions: ["smartrust-wallet", "other-wallet"],
          },
        },
      }),
    ).toThrow();
  });

  it("rejects notification payloads with provider receipt or action-link fields", () => {
    expect(() =>
      validateNotificationEvent({
        ...validNotificationEvent,
        action: {
          type: "setup",
          url: "https://mypaytag.com/actions/setup/mpt_act_456",
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

  it("validates OpenAPI examples against canonical protocol validators", () => {
    const openApi = parseYaml(readFileSync(
      fileURLToPath(new URL("../../../api/openapi.yaml", import.meta.url)),
      "utf8",
    )) as any;

    const resolvedExample =
      openApi.paths["/resolve"].post.responses["200"].content["application/json"].examples.resolved.value;
    const routeRegistrationRequestExample =
      openApi.paths["/payto-routes"].post.requestBody.content["application/json"].examples.smartrustBaseUsdc.value;
    const routeRegistrationResponseExample =
      openApi.paths["/payto-routes"].post.responses["200"].content["application/json"].examples.registered.value;
    const routeListResponseExample =
      openApi.paths["/payto-routes"].get.responses["200"].content["application/json"].examples.routes.value;
    const routeReadResponseExample =
      openApi.paths["/payto-routes/{routeId}"].get.responses["200"].content["application/json"].examples.route.value;
    const routeUpdateRequestExample =
      openApi.paths["/payto-routes/{routeId}"].patch.requestBody.content["application/json"].examples.disableRoute.value;
    const routeUpdateResponseExample =
      openApi.paths["/payto-routes/{routeId}"].patch.responses["200"].content["application/json"].examples.route.value;
    const routeDeleteResponseExample =
      openApi.paths["/payto-routes/{routeId}"].delete.responses["200"].content["application/json"].examples.revoked.value;
    const notificationExample =
      openApi.paths["/notifications"].post.requestBody.content["application/json"].examples.paymentIntentCreated.value;
    const providerCallbackExample =
      openApi.webhooks.providerPaymentIntent.post.requestBody.content["application/json"].examples.providerCallback.value;
    const providerResponseExample =
      openApi.webhooks.providerPaymentIntent.post.responses["200"].content["application/json"].examples.providerResponse.value;

    expect(validateResolveResponse(resolvedExample)).toEqual(resolvedExample);
    expect(validateRouteRegistrationRequest(routeRegistrationRequestExample)).toEqual(
      routeRegistrationRequestExample,
    );
    expect(validateRouteRegistrationResponse(routeRegistrationResponseExample)).toEqual(
      routeRegistrationResponseExample,
    );
    expect(validateRouteListResponse(routeListResponseExample)).toEqual(routeListResponseExample);
    expect(validateRouteReadResponse(routeReadResponseExample)).toEqual(routeReadResponseExample);
    expect(validateRouteUpdateRequest(routeUpdateRequestExample)).toEqual(routeUpdateRequestExample);
    expect(validateRouteReadResponse(routeUpdateResponseExample)).toEqual(routeUpdateResponseExample);
    expect(validateRouteDeleteResponse(routeDeleteResponseExample)).toEqual(routeDeleteResponseExample);
    expect(validateNotificationEvent(notificationExample)).toEqual(notificationExample);
    expect(validateProviderCallbackRequest(providerCallbackExample)).toEqual(providerCallbackExample);
    expect(validateProviderResponse(providerResponseExample)).toEqual(providerResponseExample);
  });
});
