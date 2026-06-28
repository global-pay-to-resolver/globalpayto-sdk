import {
  buildResolveRequest,
  buildNearOneClickQuoteSelectionRequest,
  getActionUrl,
  isActionRequired,
  isResolved,
  isRetryable,
  parseNearOneClickPayableInstruction,
  parseNearOneClickQuoteOption,
  parseResolveResponse,
} from "@mypaytag/sdk";
import { createMockResolver, myPayTagFixtures } from "@mypaytag/testing";

const request = buildResolveRequest({
  ...myPayTagFixtures.resolve.request,
  payingDappReference: "example:payout_001",
});

const sameChainRequest = buildResolveRequest({
  ...myPayTagFixtures.resolve.request,
  supportedPaths: [
    {
      chain: "base",
      network: "mainnet",
      asset: "USDC",
    },
  ],
  payingDappReference: "example:same_chain_001",
});

async function runScenario(label, resolverResponse) {
  const resolver = createMockResolver(resolverResponse);
  const response = parseResolveResponse(await resolver.resolve(request));

  if (isResolved(response)) {
    return {
      label,
      status: response.status,
      intentId: response.intent.id,
      provider: response.intent.paymentInstruction.provider,
      destination: response.intent.paymentInstruction.payload.destination,
    };
  }

  if (isActionRequired(response)) {
    return {
      label,
      status: response.status,
      actionUrl: getActionUrl(response),
    };
  }

  if (isRetryable(response)) {
    return {
      label,
      status: response.status,
      retry: "later",
    };
  }

  return {
    label,
    status: response.status,
    retry: "do_not_retry_without_user_or_request_change",
  };
}

const scenarios = [
  ["resolved", myPayTagFixtures.resolve.resolved],
  ["same-chain resolved", myPayTagFixtures.resolve.resolved],
  ["no route", myPayTagFixtures.resolve.noRoute],
  ["route selection required", myPayTagFixtures.resolve.routeSelectionRequired],
  ["provider failure", myPayTagFixtures.resolve.providerFailure],
];

for (const [label, response] of scenarios) {
  console.log(JSON.stringify(await runScenario(label, response), null, 2));
}

const quoteOption = parseNearOneClickQuoteOption(myPayTagFixtures.nearOneClick.quoteOption);
const quoteSelectionRequest = buildNearOneClickQuoteSelectionRequest({
  ...myPayTagFixtures.nearOneClick.quoteSelectionRequest,
  payingDappReference: sameChainRequest.payingDappReference,
});
const payableInstruction = parseNearOneClickPayableInstruction(
  myPayTagFixtures.nearOneClick.payableInstruction,
);

console.log(JSON.stringify({
  label: "near-1click quote flow",
  quoteId: quoteOption.quoteId,
  selectedRouteReference: quoteSelectionRequest.selectedRouteReference,
  payableKind: payableInstruction.instruction.kind,
  depositAsset: payableInstruction.instruction.payload.depositAsset,
  recipientAmount: payableInstruction.instruction.payload.recipientAmount,
}, null, 2));
