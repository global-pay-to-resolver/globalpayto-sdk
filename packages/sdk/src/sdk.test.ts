import { describe, expect, it } from "vitest";

import {
  validNoRouteResponse,
  validNearOneClickPayableInstruction,
  validNearOneClickQuoteOption,
  validNearOneClickQuoteSelectionRequest,
  validNotificationEvent,
  validResolvedResponse,
  validResolveRequest,
  validRouteSelectionResponse,
  validProviderCallbackRequest,
  validRouteRegistrationRequest,
} from "@mypaytag/protocol";

import {
  buildResolveRequest,
  buildAmountValue,
  buildNearOneClickQuoteSelectionRequest,
  buildPayorAppReference,
  buildPayorAppResolveRequest,
  buildSupportedPath,
  getActionUrl,
  isActionRequired,
  isMyPayTagNotification,
  isResolved,
  parseNotificationEvent,
  parseResolveResponse,
  requestNearOneClickQuoteOptions,
  requestExecutionQuotes,
  selectNearOneClickQuote,
  parseNearOneClickPayableInstruction,
  parseNearOneClickQuoteOption,
  type CryptoNativeExecutionSolverId,
  type ExecutionQuoteProvider,
} from "./index.js";

describe("@mypaytag/sdk", () => {
  it("builds and validates resolve requests", () => {
    expect(buildResolveRequest(validResolveRequest)).toEqual(validResolveRequest);
  });

  it("keeps public MVP payloads on the paytag identifier contract", () => {
    expect(validResolveRequest.recipient.identifierType).toBe("paytag");
    expect(validResolvedResponse.intent.recipient.identifierType).toBe("paytag");
    expect(validNotificationEvent.recipient.identifierType).toBe("paytag");
    expect(validRouteRegistrationRequest.recipient.identifierType).toBe("paytag");
    expect(validProviderCallbackRequest.recipient.identifierType).toBe("paytag");
  });

  it("builds generic payor-app resolve request inputs", () => {
    const supportedPath = buildSupportedPath({
      chain: " base ",
      network: " mainnet ",
      asset: " USDC ",
    });
    const amount = buildAmountValue({
      value: "25.00",
      currency: "USDC",
    });

    const result = buildPayorAppResolveRequest({
      recipientIdentifier: "abd123@cubid.mypaytag",
      supportedPaths: [supportedPath],
      amount,
      purpose: "wallet_send",
      payingDappReference: buildPayorAppReference({
        payorAppId: "smartrust-wallet",
        reference: "send_123",
      }),
      amountExactness: "exact_send",
    });

    expect(result.amountExactness).toBe("exact_send");
    expect(result.request).toEqual({
      ...validResolveRequest,
      supportedPaths: [
        {
          chain: "base",
          network: "mainnet",
          asset: "USDC",
        },
      ],
      purpose: "wallet_send",
      payingDappReference: "smartrust-wallet:send_123",
    });
  });

  it("defaults payor-app helper exactness to exact receive", () => {
    const result = buildPayorAppResolveRequest({
      recipientIdentifier: "abd123@cubid.mypaytag",
      supportedPaths: validResolveRequest.supportedPaths,
      amount: validResolveRequest.amount,
      purpose: validResolveRequest.purpose,
      payingDappReference: validResolveRequest.payingDappReference,
    });

    expect(result.amountExactness).toBe("exact_receive");
  });

  it("rejects empty payor-app request fields before schema validation", () => {
    expect(() =>
      buildPayorAppResolveRequest({
        recipientIdentifier: "abd123@cubid.mypaytag",
        supportedPaths: [],
        amount: validResolveRequest.amount,
        purpose: validResolveRequest.purpose,
        payingDappReference: validResolveRequest.payingDappReference,
      })
    ).toThrow("supportedPaths must include at least one route path");

    expect(() =>
      buildPayorAppReference({
        payorAppId: " ",
        reference: "send_123",
      })
    ).toThrow("payorAppId must be a non-empty string");
  });

  it("parses and narrows resolved responses", () => {
    const response = parseResolveResponse(validResolvedResponse);

    expect(isResolved(response)).toBe(true);
    expect(isActionRequired(response)).toBe(false);
  });

  it("keeps route-selection action URLs visible for integrators", () => {
    const response = parseResolveResponse(validRouteSelectionResponse);

    expect(isActionRequired(response)).toBe(true);
    expect(getActionUrl(response)).toBe("https://mypaytag.com/actions/route-selection/mpt_act_789");
  });

  it("treats no-route responses as status-only", () => {
    const response = parseResolveResponse(validNoRouteResponse);

    expect(isActionRequired(response)).toBe(false);
    expect(getActionUrl(response)).toBeUndefined();
  });

  it("guards Cubid comms notification payloads", () => {
    expect(isMyPayTagNotification(validNotificationEvent)).toBe(true);
    expect(parseNotificationEvent(validNotificationEvent)).toEqual(validNotificationEvent);
  });

  it("parses the Phase 1 NEAR 1Click MVP quote option", () => {
    expect(parseNearOneClickQuoteOption(validNearOneClickQuoteOption)).toEqual(
      validNearOneClickQuoteOption,
    );
  });

  it("builds selected NEAR 1Click quote requests and parses payable instructions", () => {
    expect(buildNearOneClickQuoteSelectionRequest(validNearOneClickQuoteSelectionRequest)).toEqual(
      validNearOneClickQuoteSelectionRequest,
    );
    expect(parseNearOneClickPayableInstruction(validNearOneClickPayableInstruction)).toEqual(
      validNearOneClickPayableInstruction,
    );
  });

  it("calls NEAR 1Click quote and selected-quote backend endpoints", async () => {
    const calls: Array<{ endpoint: string; body: unknown }> = [];
    const fakeFetch: typeof fetch = async (input, init) => {
      calls.push({
        endpoint: String(input),
        body: JSON.parse(String(init?.body)),
      });
      if (String(input).endsWith("/near-oneclick-quotes")) {
        return jsonResponse({
          status: "quoted",
          adapter: "near_intents_1click",
          resolverReference: validNearOneClickQuoteOption.resolverReference,
          selectedRouteReference: validNearOneClickQuoteOption.selectedRouteReference,
          quotes: [validNearOneClickQuoteOption],
        });
      }
      return jsonResponse(validNearOneClickPayableInstruction);
    };

    const quotes = await requestNearOneClickQuoteOptions({
      endpoint: "https://resolver.test/functions/v1/near-oneclick-quotes",
      fetch: fakeFetch,
      headers: { "x-mypaytag-dapp-id": "smartrust-wallet" },
      request: {
        sourceAsset: "near/mainnet/USDC",
        sourceAmount: "25.18",
        payorReference: "smartrust:send_001",
        receiveRequirement: {
          destinationAsset: "base/mainnet/USDC",
          recipient: validNearOneClickQuoteOption.selectedRouteReference,
          amount: "25.00",
          expiresAt: validNearOneClickQuoteOption.expiresAt,
          resolverReference: validNearOneClickQuoteOption.resolverReference,
        },
      },
    });
    const instruction = await selectNearOneClickQuote({
      endpoint: "https://resolver.test/functions/v1/near-oneclick-selected-quote",
      fetch: fakeFetch,
      request: validNearOneClickQuoteSelectionRequest,
    });

    expect(quotes.quotes).toEqual([validNearOneClickQuoteOption]);
    expect(instruction).toEqual(validNearOneClickPayableInstruction);
    expect(calls.map((call) => call.endpoint)).toEqual([
      "https://resolver.test/functions/v1/near-oneclick-quotes",
      "https://resolver.test/functions/v1/near-oneclick-selected-quote",
    ]);
    expect(calls[1].body).toEqual(validNearOneClickQuoteSelectionRequest);
  });

  it("requests Phase 2 extension quotes from every configured solver when none is preferred", async () => {
    const calls: CryptoNativeExecutionSolverId[] = [];
    const providers = [
      createQuoteProvider("lifi", calls),
      createQuoteProvider("squid", calls),
      createQuoteProvider("across", calls),
    ];

    const quotes = await requestExecutionQuotes({
      providers,
      request: quoteRequest,
    });

    expect(calls).toEqual(["lifi", "squid", "across"]);
    expect(quotes.map((quote) => quote.solverId)).toEqual(["lifi", "squid", "across"]);
  });

  it("requests a Phase 2 extension quote only from the preferred solver when provided", async () => {
    const calls: CryptoNativeExecutionSolverId[] = [];
    const providers = [
      createQuoteProvider("lifi", calls),
      createQuoteProvider("squid", calls),
      createQuoteProvider("across", calls),
    ];

    const quotes = await requestExecutionQuotes({
      preferredSolverId: "lifi",
      providers,
      request: quoteRequest,
    });

    expect(calls).toEqual(["lifi"]);
    expect(quotes.map((quote) => quote.solverId)).toEqual(["lifi"]);
  });

  it("returns successful Phase 2 extension quotes when some configured solvers fail", async () => {
    const calls: CryptoNativeExecutionSolverId[] = [];
    const providers = [
      createQuoteProvider("zero_x_cross_chain", calls, { fail: true }),
      createQuoteProvider("lifi", calls),
      createQuoteProvider("squid", calls, { fail: true }),
    ];

    const quotes = await requestExecutionQuotes({
      providers,
      request: quoteRequest,
    });

    expect(calls).toEqual(["zero_x_cross_chain", "lifi", "squid"]);
    expect(quotes.map((quote) => quote.solverId)).toEqual(["lifi"]);
  });

  it("throws when every configured quote provider fails", async () => {
    await expect(requestExecutionQuotes({
      providers: [
        createQuoteProvider("zero_x_cross_chain", [], { fail: true }),
        createQuoteProvider("lifi", [], { fail: true }),
      ],
      request: quoteRequest,
    })).rejects.toThrow("quote_providers_unavailable");
  });
});

const quoteRequest = {
  amount: {
    value: "25.00",
    currency: "USDC",
  },
  destinationAsset: "eip155:8453/erc20:0x...",
  recipient: "eip155:8453:0xabc",
  sourceAsset: "eip155:1/erc20:0x...",
};

function createQuoteProvider(
  solverId: CryptoNativeExecutionSolverId,
  calls: CryptoNativeExecutionSolverId[],
  options: { fail?: boolean } = {},
): ExecutionQuoteProvider {
  return {
    solverId,
    async requestQuote() {
      calls.push(solverId);
      if (options.fail) throw new Error(`failed_${solverId}`);
      return {
        solverId,
        quoteId: `quote_${solverId}`,
      };
    },
  };
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
