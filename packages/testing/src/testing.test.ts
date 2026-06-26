import { describe, expect, it } from "vitest";

import {
  requestExecutionQuotes,
} from "@globalpayto/sdk";

import {
  createMockCubidValidator,
  createMockExecutionQuoteProvider,
  createMockPayToDapp,
  createMockResolver,
  createPaymentIntentCreatedNotification,
  globalPayToFixtures,
} from "./index.js";

describe("@globalpayto/testing", () => {
  it("exports reusable MVP fixtures", () => {
    expect(globalPayToFixtures.resolve.request.intentMode).toBe("one_time");
    expect(globalPayToFixtures.notifications.paymentIntentCreated.eventType).toBe(
      "payment_intent_created",
    );
    expect(globalPayToFixtures.routeRegistration.forbiddenAddress).toHaveProperty("address");
    expect(globalPayToFixtures.routeOptions.directTransfer.method).toBe("direct_transfer");
    expect(globalPayToFixtures.routeOptions.sameChainExchange.method).toBe("provider_exchange");
    expect(globalPayToFixtures.routeOptions.bridge.method).toBe("bridge");
    expect(globalPayToFixtures.routeOptions.crossChainIntent.method).toBe("cross_chain_intent");
    expect(globalPayToFixtures.routeOptions.noRoute.status).toBe("no_route");
    expect(globalPayToFixtures.routeOptions.routeSelectionRequired.status).toBe(
      "user_action_required",
    );
    expect(globalPayToFixtures.routeOptions.providerUnavailable.status).toBe(
      "provider_unavailable",
    );
    expect(globalPayToFixtures.routeOptions.insufficientBalance.status).toBe("invalid_request");
    expect(globalPayToFixtures.executionQuotes.exactSendRequest.reference).toBe(
      "example-payor:exact-send",
    );
    expect(globalPayToFixtures.executionQuotes.exactReceiveRequest.reference).toBe(
      "example-payor:exact-receive",
    );
  });

  it("provides a mock Cubid validator", async () => {
    const validator = createMockCubidValidator();

    await expect(validator.validateStamp("email:noak@example.com")).resolves.toMatchObject({
      alias: "cubid_stamp_alias_abc",
      valid: true,
    });
  });

  it("provides mock resolver and PayToDapp services", async () => {
    const resolver = createMockResolver();
    const payToDapp = createMockPayToDapp();

    await expect(resolver.resolve(globalPayToFixtures.resolve.request)).resolves.toEqual(
      globalPayToFixtures.resolve.resolved,
    );
    await expect(
      payToDapp.createPaymentIntent(globalPayToFixtures.provider.callback),
    ).resolves.toEqual(globalPayToFixtures.provider.response);
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
      request: globalPayToFixtures.executionQuotes.exactReceiveRequest,
    })).resolves.toMatchObject([
      {
        solverId: "lifi",
      },
    ]);

    await expect(requestExecutionQuotes({
      providers,
      request: globalPayToFixtures.executionQuotes.exactSendRequest,
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
      request: globalPayToFixtures.executionQuotes.exactSendRequest,
    })).rejects.toThrow("quote_providers_unavailable");
  });
});
