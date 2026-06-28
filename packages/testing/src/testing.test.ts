import { describe, expect, it } from "vitest";

import {
  requestExecutionQuotes,
} from "@mypaytag/sdk";

import {
  createMockPaytagValidator,
  createMockExecutionQuoteProvider,
  createMockPayToDapp,
  createMockResolver,
  createPaymentIntentCreatedNotification,
  myPayTagFixtures,
} from "./index.js";

describe("@mypaytag/testing", () => {
  it("exports reusable MVP fixtures", () => {
    expect(myPayTagFixtures.resolve.request.intentMode).toBe("one_time");
    expect(myPayTagFixtures.notifications.paymentIntentCreated.eventType).toBe(
      "payment_intent_created",
    );
    expect(myPayTagFixtures.routeRegistration.forbiddenAddress).toHaveProperty("address");
    expect(myPayTagFixtures.routeOptions.directTransfer.method).toBe("direct_transfer");
    expect(myPayTagFixtures.routeOptions.sameChainExchange.method).toBe("provider_exchange");
    expect(myPayTagFixtures.routeOptions.bridge.method).toBe("bridge");
    expect(myPayTagFixtures.routeOptions.crossChainIntent.method).toBe("cross_chain_intent");
    expect(myPayTagFixtures.routeOptions.noRoute.status).toBe("no_route");
    expect(myPayTagFixtures.routeOptions.routeSelectionRequired.status).toBe(
      "user_action_required",
    );
    expect(myPayTagFixtures.routeOptions.providerUnavailable.status).toBe(
      "provider_unavailable",
    );
    expect(myPayTagFixtures.routeOptions.insufficientBalance.status).toBe("invalid_request");
    expect(myPayTagFixtures.executionQuotes.exactSendRequest.reference).toBe(
      "example-payor:exact-send",
    );
    expect(myPayTagFixtures.executionQuotes.exactReceiveRequest.reference).toBe(
      "example-payor:exact-receive",
    );
  });

  it("provides a mock paytag validator", async () => {
    const validator = createMockPaytagValidator();

    await expect(validator.validatePaytag("abd123@cubid.mypaytag")).resolves.toMatchObject({
      paytagReference: "paytag_ref_abc",
      valid: true,
    });
  });

  it("provides mock resolver and PayToDapp services", async () => {
    const resolver = createMockResolver();
    const payToDapp = createMockPayToDapp();

    await expect(resolver.resolve(myPayTagFixtures.resolve.request)).resolves.toEqual(
      myPayTagFixtures.resolve.resolved,
    );
    await expect(
      payToDapp.createPaymentIntent(myPayTagFixtures.provider.callback),
    ).resolves.toEqual(myPayTagFixtures.provider.response);
  });

  it("creates intent-created notifications only", () => {
    expect(createPaymentIntentCreatedNotification().eventType).toBe("payment_intent_created");
  });

  it("provides mock quote providers for preferred-solver and fanout tests", async () => {
    const providers = [
      createMockExecutionQuoteProvider({ solverId: "near_intents_1click" }),
      createMockExecutionQuoteProvider({ solverId: "lifi" }),
      createMockExecutionQuoteProvider({ solverId: "squid", failWith: "provider_unavailable" }),
    ];

    await expect(requestExecutionQuotes({
      preferredSolverId: "lifi",
      providers,
      request: myPayTagFixtures.executionQuotes.exactReceiveRequest,
    })).resolves.toMatchObject([
      {
        solverId: "lifi",
      },
    ]);

    await expect(requestExecutionQuotes({
      providers,
      request: myPayTagFixtures.executionQuotes.exactSendRequest,
    })).resolves.toMatchObject([
      {
        solverId: "near_intents_1click",
      },
      {
        solverId: "lifi",
      },
    ]);
  });

  it("can model all configured quote providers being unavailable", async () => {
    await expect(requestExecutionQuotes({
      providers: [
        createMockExecutionQuoteProvider({
          solverId: "near_intents_1click",
          failWith: "provider_unavailable",
        }),
        createMockExecutionQuoteProvider({
          solverId: "lifi",
          failWith: "insufficient_balance",
        }),
      ],
      request: myPayTagFixtures.executionQuotes.exactSendRequest,
    })).rejects.toThrow("quote_providers_unavailable");
  });
});
