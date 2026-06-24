import { describe, expect, it } from "vitest";

import {
  validProviderCallbackRequest,
  validProviderResponse,
  validRouteRegistrationRequest,
} from "@globalpayto/protocol";

import {
  assertProviderResponseMatchesCallback,
  buildRouteRegistrationRequest,
  parseProviderCallbackRequest,
  parseProviderResponse,
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
  resolverRequestId: "gptr_req_123",
  signature: "sig_123",
  nonce: "nonce_123",
  timestamp: "2026-06-24T20:00:00Z",
  expiresAt: "2026-06-24T20:05:00Z",
};

describe("@globalpayto/provider-sdk", () => {
  it("builds route registration requests", () => {
    expect(buildRouteRegistrationRequest(validRouteRegistrationRequest)).toEqual(
      validRouteRegistrationRequest,
    );
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

  it("exposes auth and replay integration hooks", async () => {
    const replayStore = createMemoryReplayStore();
    const verifier = { verify: () => true };

    await expect(verifyCallbackAuth(authEnvelope, verifier, replayStore)).resolves.toBe(true);
    await expect(verifyCallbackAuth(authEnvelope, verifier, replayStore)).resolves.toBe(false);
  });
});
