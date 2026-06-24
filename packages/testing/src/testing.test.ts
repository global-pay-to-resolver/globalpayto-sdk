import { describe, expect, it } from "vitest";

import {
  createMockCubidValidator,
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
});
