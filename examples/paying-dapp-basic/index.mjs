import {
  buildResolveRequest,
  getActionUrl,
  isActionRequired,
  isResolved,
  isRetryable,
  parseResolveResponse,
} from "@globalpayto/sdk";
import { createMockResolver, globalPayToFixtures } from "@globalpayto/testing";

const request = buildResolveRequest({
  ...globalPayToFixtures.resolve.request,
  payingDappReference: "example:payout_001",
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
  ["resolved", globalPayToFixtures.resolve.resolved],
  ["no route", globalPayToFixtures.resolve.noRoute],
  ["route selection required", globalPayToFixtures.resolve.routeSelectionRequired],
  ["provider failure", globalPayToFixtures.resolve.providerFailure],
];

for (const [label, response] of scenarios) {
  console.log(JSON.stringify(await runScenario(label, response), null, 2));
}
