import { describe, expect, it } from "vitest";

import {
  validNoRouteResponse,
  validNotificationEvent,
  validResolvedResponse,
  validResolveRequest,
  validRouteSelectionResponse,
} from "@globalpayto/protocol";

import {
  buildResolveRequest,
  getActionUrl,
  isActionRequired,
  isGlobalPayToNotification,
  isResolved,
  parseNotificationEvent,
  parseResolveResponse,
} from "./index.js";

describe("@globalpayto/sdk", () => {
  it("builds and validates resolve requests", () => {
    expect(buildResolveRequest(validResolveRequest)).toEqual(validResolveRequest);
  });

  it("parses and narrows resolved responses", () => {
    const response = parseResolveResponse(validResolvedResponse);

    expect(isResolved(response)).toBe(true);
    expect(isActionRequired(response)).toBe(false);
  });

  it("keeps route-selection action URLs visible for integrators", () => {
    const response = parseResolveResponse(validRouteSelectionResponse);

    expect(isActionRequired(response)).toBe(true);
    expect(getActionUrl(response)).toBe("https://globalpayto.example/actions/route-selection/gptr_act_789");
  });

  it("treats no-route responses as status-only", () => {
    const response = parseResolveResponse(validNoRouteResponse);

    expect(isActionRequired(response)).toBe(false);
    expect(getActionUrl(response)).toBeUndefined();
  });

  it("guards Cubid comms notification payloads", () => {
    expect(isGlobalPayToNotification(validNotificationEvent)).toBe(true);
    expect(parseNotificationEvent(validNotificationEvent)).toEqual(validNotificationEvent);
  });
});
