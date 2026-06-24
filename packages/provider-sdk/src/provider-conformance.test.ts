import { describe, expect, it } from "vitest";

import {
  validateGlobalPayToIntent,
  validGlobalPayToIntent,
  validProviderCallbackRequest,
  validProviderResponse,
  type ProviderResponse,
} from "@globalpayto/protocol";

import {
  assertProviderResponseMatchesCallback,
  parseProviderCallbackRequest,
  parseProviderResponse,
  verifyCallbackAuth,
  type CallbackAuthEnvelope,
  type ReplayStore,
} from "./index.js";

function createReplayStore(): ReplayStore & { remembered: string[] } {
  const seen = new Set<string>();
  const remembered: string[] = [];

  return {
    remembered,
    has: (key) => seen.has(key),
    remember: (key) => {
      seen.add(key);
      remembered.push(key);
    },
  };
}

const freshEnvelope: CallbackAuthEnvelope = {
  method: "POST",
  url: "https://paytodapp.example/payment-intents",
  bodyDigest: "sha256:callback-body",
  resolverRequestId: validProviderCallbackRequest.resolverRequestId,
  signature: "sha256:test-signature",
  nonce: "nonce-001",
  timestamp: "2026-06-24T20:00:00Z",
  expiresAt: "2026-06-24T20:05:00Z",
};

describe("PayToDapp provider conformance", () => {
  it("accepts a valid callback request and matching provider intent response", () => {
    const callback = parseProviderCallbackRequest(validProviderCallbackRequest);
    const response = parseProviderResponse(validProviderResponse);

    expect(assertProviderResponseMatchesCallback(callback, response)).toEqual(response);
  });

  it("requires callbacks to use Cubid aliases instead of raw identifiers", () => {
    expect(() =>
      parseProviderCallbackRequest({
        ...validProviderCallbackRequest,
        recipient: {
          identifierType: "verified_stamp",
          identifier: "email:noak@example.com",
        },
      }),
    ).toThrow();
  });

  it("expects callback auth freshness checks before replay persistence", async () => {
    const replayStore = createReplayStore();
    const verifier = { verify: () => true };

    await expect(
      verifyCallbackAuth(freshEnvelope, verifier, replayStore, {
        now: new Date("2026-06-24T20:01:00Z"),
      }),
    ).resolves.toBe(true);
    expect(replayStore.remembered).toHaveLength(1);

    await expect(
      verifyCallbackAuth(freshEnvelope, verifier, replayStore, {
        now: new Date("2026-06-24T20:01:00Z"),
      }),
    ).resolves.toBe(false);
    expect(replayStore.remembered).toHaveLength(1);
  });

  it("rejects stale or far-future callback envelopes without verifier calls", async () => {
    const replayStore = createReplayStore();
    const verifier = {
      verify: () => {
        throw new Error("verifier should not be called for stale envelopes");
      },
    };

    await expect(
      verifyCallbackAuth(
        { ...freshEnvelope, expiresAt: "2026-06-24T19:59:00Z" },
        verifier,
        replayStore,
        { now: new Date("2026-06-24T20:01:00Z") },
      ),
    ).resolves.toBe(false);
    await expect(
      verifyCallbackAuth(
        { ...freshEnvelope, timestamp: "2026-06-24T20:30:00Z" },
        verifier,
        replayStore,
        { now: new Date("2026-06-24T20:01:00Z") },
      ),
    ).resolves.toBe(false);
    expect(replayStore.remembered).toHaveLength(0);
  });

  it("rejects provider error statuses and malformed provider payloads", () => {
    for (const response of [
      { ...validProviderResponse, status: "failed" },
      {
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            destination: undefined,
          },
        },
      },
      {
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            recipientAddress: "0xabc123",
          },
        },
      },
    ]) {
      expect(() => parseProviderResponse(response)).toThrow();
    }
  });

  it("rejects provider responses that do not match callback path, amount, or idempotency identity", () => {
    const malformedResponses: ProviderResponse[] = [
      {
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            network: "testnet",
          },
        },
      },
      {
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            amount: "26.00",
          },
        },
      },
      {
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            providerIntentId: "different_provider_intent",
          },
        },
      },
    ];

    for (const response of malformedResponses) {
      expect(() => assertProviderResponseMatchesCallback(validProviderCallbackRequest, response)).toThrow();
    }
  });

  it("keeps provider payloads inside the GlobalPayTo intent envelope", () => {
    const intent = {
      ...validGlobalPayToIntent,
      paymentInstruction: validProviderResponse.paymentInstruction,
      references: {
        ...validGlobalPayToIntent.references,
        providerReference: validProviderResponse.providerIntentId,
      },
    };

    expect(validateGlobalPayToIntent(intent)).toEqual(intent);
    expect(() =>
      validateGlobalPayToIntent({
        ...intent,
        paymentInstruction: {
          ...intent.paymentInstruction,
          payload: {
            ...intent.paymentInstruction.payload,
            address: "0xabc123",
          },
        },
      }),
    ).toThrow();
  });
});
