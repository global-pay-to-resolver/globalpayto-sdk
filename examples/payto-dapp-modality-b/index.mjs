import {
  assertProviderResponseMatchesCallback,
  buildRouteRegistrationRequest,
  parseProviderCallbackRequest,
  parseProviderResponse,
  verifyCallbackAuth,
} from "@globalpayto/provider-sdk";
import { createMockPayToDapp, globalPayToFixtures } from "@globalpayto/testing";

function createMemoryReplayStore() {
  const seen = new Set();

  return {
    has: (key) => seen.has(key),
    remember: (key) => {
      seen.add(key);
    },
  };
}

const routeRegistration = buildRouteRegistrationRequest(globalPayToFixtures.routeRegistration.valid);

const callbackAuthEnvelope = {
  method: "POST",
  url: "https://smartrust.example.test/payment-intents",
  bodyDigest: "sha256:example-body",
  resolverRequestId: globalPayToFixtures.provider.callback.resolverRequestId,
  signature: await hmacSignature("modality-b-test-key", [
    "POST",
    "https://smartrust.example.test/payment-intents",
    "sha256:example-body",
    globalPayToFixtures.provider.callback.resolverRequestId,
    "example-nonce",
    "2026-06-24T20:00:00Z",
  ].join("\n")),
  nonce: "example-nonce",
  timestamp: "2026-06-24T20:00:00Z",
  expiresAt: "2026-06-24T20:05:00Z",
};

const replayStore = createMemoryReplayStore();
const verifier = {
  async verify(envelope) {
    const canonical = [
      envelope.method,
      envelope.url,
      envelope.bodyDigest,
      envelope.resolverRequestId,
      envelope.nonce,
      envelope.timestamp,
    ].join("\n");
    return envelope.signature === await hmacSignature("modality-b-test-key", canonical);
  },
};

const firstAuthCheck = await verifyCallbackAuth(callbackAuthEnvelope, verifier, replayStore, {
  now: new Date("2026-06-24T20:01:00Z"),
});
const replayAuthCheck = await verifyCallbackAuth(callbackAuthEnvelope, verifier, replayStore, {
  now: new Date("2026-06-24T20:01:00Z"),
});

const callback = parseProviderCallbackRequest(globalPayToFixtures.provider.callback);
const payToDapp = createMockPayToDapp(globalPayToFixtures.provider.response);
const providerResponse = parseProviderResponse(await payToDapp.createPaymentIntent(callback));
const matchedResponse = assertProviderResponseMatchesCallback(callback, providerResponse);

console.log(
  JSON.stringify(
    {
      routeRegistration: {
        payToDappId: routeRegistration.payToDappId,
        supportedRoutes: routeRegistration.supportedRoutes,
        containsWalletAddress: "address" in routeRegistration || "recipientAddress" in routeRegistration,
      },
      callbackAuth: {
        firstAuthCheck,
        replayAuthCheck,
      },
      providerIntent: {
        providerIntentId: matchedResponse.providerIntentId,
        destination: matchedResponse.paymentInstruction.payload.destination,
      },
    },
    null,
    2,
  ),
);

async function hmacSignature(secret, value) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  const hex = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `sha256=${hex}`;
}
