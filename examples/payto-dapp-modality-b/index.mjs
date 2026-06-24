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
  signature: "example-signature",
  nonce: "example-nonce",
  timestamp: "2026-06-24T20:00:00Z",
  expiresAt: globalPayToFixtures.provider.callback.expiresAt,
};

const replayStore = createMemoryReplayStore();
const verifier = {
  // REVIEW: This accepts any non-empty signature, which is easy to copy into a real integration.
  // Replace the example with an HMAC verification stub that checks method, URL, body digest,
  // resolver request id, nonce, and timestamp against a named test key.
  verify: (envelope) => envelope.signature.length > 0,
};

const firstAuthCheck = await verifyCallbackAuth(callbackAuthEnvelope, verifier, replayStore);
const replayAuthCheck = await verifyCallbackAuth(callbackAuthEnvelope, verifier, replayStore);

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
