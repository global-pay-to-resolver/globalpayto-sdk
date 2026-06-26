import { describe, expect, it } from "vitest";

import {
  validNoRouteResponse,
  validNotificationEvent,
  validResolvedResponse,
  validResolveRequest,
  validRouteSelectionResponse,
} from "@globalpayto/protocol";

import {
  buildResolveRequest,
  getActionUrl,
  isActionRequired,
  isGlobalPayToNotification,
  isResolved,
  parseNotificationEvent,
  parseResolveResponse,
  requestExecutionQuotes,
  type CryptoNativeExecutionSolverId,
  type ExecutionQuoteProvider,
} from "./index.js";

describe("@globalpayto/sdk", () => {
  it("builds and validates resolve requests", () => {
    expect(buildResolveRequest(validResolveRequest)).toEqual(validResolveRequest);
  });

  it("parses and narrows resolved responses", () => {
    const response = parseResolveResponse(validResolvedResponse);

    expect(isResolved(response)).toBe(true);
    expect(isActionRequired(response)).toBe(false);
  });

  it("keeps route-selection action URLs visible for integrators", () => {
    const response = parseResolveResponse(validRouteSelectionResponse);

    expect(isActionRequired(response)).toBe(true);
    expect(getActionUrl(response)).toBe("https://globalpayto.example/actions/route-selection/gptr_act_789");
  });

  it("treats no-route responses as status-only", () => {
    const response = parseResolveResponse(validNoRouteResponse);

    expect(isActionRequired(response)).toBe(false);
    expect(getActionUrl(response)).toBeUndefined();
  });

  it("guards Cubid comms notification payloads", () => {
    expect(isGlobalPayToNotification(validNotificationEvent)).toBe(true);
    expect(parseNotificationEvent(validNotificationEvent)).toEqual(validNotificationEvent);
  });

  it("requests execution quotes from every configured solver when none is preferred", async () => {
    const calls: CryptoNativeExecutionSolverId[] = [];
    const providers = [
      createQuoteProvider("near_intents_1click", calls),
      createQuoteProvider("lifi", calls),
      createQuoteProvider("squid", calls),
    ];

    const quotes = await requestExecutionQuotes({
      providers,
      request: quoteRequest,
    });

    expect(calls).toEqual(["near_intents_1click", "lifi", "squid"]);
    expect(quotes.map((quote) => quote.solverId)).toEqual(["near_intents_1click", "lifi", "squid"]);
  });

  it("requests an execution quote only from the preferred solver when provided", async () => {
    const calls: CryptoNativeExecutionSolverId[] = [];
    const providers = [
      createQuoteProvider("near_intents_1click", calls),
      createQuoteProvider("lifi", calls),
      createQuoteProvider("squid", calls),
    ];

    const quotes = await requestExecutionQuotes({
      preferredSolverId: "lifi",
      providers,
      request: quoteRequest,
    });

    expect(calls).toEqual(["lifi"]);
    expect(quotes.map((quote) => quote.solverId)).toEqual(["lifi"]);
  });

  it("returns successful quotes when some configured solvers fail", async () => {
    const calls: CryptoNativeExecutionSolverId[] = [];
    const providers = [
      createQuoteProvider("near_intents_1click", calls, { fail: true }),
      createQuoteProvider("lifi", calls),
      createQuoteProvider("squid", calls, { fail: true }),
    ];

    const quotes = await requestExecutionQuotes({
      providers,
      request: quoteRequest,
    });

    expect(calls).toEqual(["near_intents_1click", "lifi", "squid"]);
    expect(quotes.map((quote) => quote.solverId)).toEqual(["lifi"]);
  });

  it("throws when every configured quote provider fails", async () => {
    await expect(requestExecutionQuotes({
      providers: [
        createQuoteProvider("near_intents_1click", [], { fail: true }),
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
