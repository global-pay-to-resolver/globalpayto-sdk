import { describe, expect, it } from "vitest";

import {
  validProviderCallbackRequest,
  validProviderResponse,
  validRouteDeleteResponse,
  validRouteListResponse,
  validRouteRegistrationRequest,
  validRouteReadResponse,
  validRouteUpdateRequest,
} from "@mypaytag/protocol";

import {
  assertProviderResponseMatchesCallback,
  buildRouteRegistrationRequest,
  buildRouteUpdateRequest,
  parseProviderCallbackRequest,
  parseProviderResponse,
  parseRouteDeleteResponse,
  parseRouteListResponse,
  parseRouteReadResponse,
  verifyCallbackAuth,
  type CallbackAuthEnvelope,
  type ReplayStore,
} from "./index.js";

function createMemoryReplayStore(): ReplayStore {
  const seen = new Set<string>();

  return {
    has: (key) => seen.has(key),
    remember: (key) => {
      seen.add(key);
    },
  };
}

const authEnvelope: CallbackAuthEnvelope = {
  method: "POST",
  url: "https://wallet.example/payment-intents",
  bodyDigest: "sha256:abc",
  resolverRequestId: "mpt_req_123",
  signature: "sig_123",
  nonce: "nonce_123",
  timestamp: "2026-06-24T20:00:00Z",
  expiresAt: "2026-06-24T20:05:00Z",
};

describe("@mypaytag/provider-sdk", () => {
  it("builds route registration requests", () => {
    expect(buildRouteRegistrationRequest(validRouteRegistrationRequest)).toEqual(
      validRouteRegistrationRequest,
    );
  });

  it("builds route updates and parses route CRUD responses", () => {
    expect(buildRouteUpdateRequest(validRouteUpdateRequest)).toEqual(validRouteUpdateRequest);
    expect(parseRouteListResponse(validRouteListResponse)).toEqual(validRouteListResponse);
    expect(parseRouteReadResponse(validRouteReadResponse)).toEqual(validRouteReadResponse);
    expect(parseRouteDeleteResponse(validRouteDeleteResponse)).toEqual(validRouteDeleteResponse);
  });

  it("validates callback requests and provider responses", () => {
    const callback = parseProviderCallbackRequest(validProviderCallbackRequest);
    const response = parseProviderResponse(validProviderResponse);

    expect(assertProviderResponseMatchesCallback(callback, response)).toEqual(response);
  });

  it("rejects mismatched provider response path or amount", () => {
    expect(() =>
      assertProviderResponseMatchesCallback(validProviderCallbackRequest, {
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            network: "testnet",
          },
        },
      }),
    ).toThrow();
  });

  it("rejects provider response binding mismatches", () => {
    for (const payloadOverride of [
      { resolverReference: "mpt_req_other" },
      { payingDappId: "other-paying-dapp" },
      { payingDappReference: "chaincrew:payout_other" },
      { purpose: "refund" },
      { expiresAt: "2026-06-24T21:00:00Z" },
    ] as const) {
      expect(() =>
        assertProviderResponseMatchesCallback(validProviderCallbackRequest, {
          ...validProviderResponse,
          paymentInstruction: {
            ...validProviderResponse.paymentInstruction,
            payload: {
              ...validProviderResponse.paymentInstruction.payload,
              ...payloadOverride,
            },
          },
        }),
      ).toThrow();
    }
  });

  it("exposes auth and replay integration hooks", async () => {
    const replayStore = createMemoryReplayStore();
    const verifier = { verify: () => true };

    await expect(
      verifyCallbackAuth(authEnvelope, verifier, replayStore, {
        now: new Date("2026-06-24T20:01:00Z"),
      }),
    ).resolves.toBe(true);
    await expect(
      verifyCallbackAuth(authEnvelope, verifier, replayStore, {
        now: new Date("2026-06-24T20:01:00Z"),
      }),
    ).resolves.toBe(false);
  });

  it("rejects expired and far-future callback envelopes before verifier work", async () => {
    const replayStore = createMemoryReplayStore();
    const verifier = { verify: () => {
      throw new Error("verifier should not be called");
    } };

    await expect(
      verifyCallbackAuth(
        { ...authEnvelope, expiresAt: "2026-06-24T19:59:00Z" },
        verifier,
        replayStore,
        { now: new Date("2026-06-24T20:01:00Z") },
      ),
    ).resolves.toBe(false);
    await expect(
      verifyCallbackAuth(
        { ...authEnvelope, timestamp: "2026-06-24T20:20:00Z" },
        verifier,
        replayStore,
        { now: new Date("2026-06-24T20:01:00Z") },
      ),
    ).resolves.toBe(false);
  });

  it("rejects provider response id mismatch", () => {
    expect(() =>
      assertProviderResponseMatchesCallback(validProviderCallbackRequest, {
        ...validProviderResponse,
        paymentInstruction: {
          ...validProviderResponse.paymentInstruction,
          payload: {
            ...validProviderResponse.paymentInstruction.payload,
            providerIntentId: "different_provider_intent",
          },
        },
      }),
    ).toThrow();
  });
});
