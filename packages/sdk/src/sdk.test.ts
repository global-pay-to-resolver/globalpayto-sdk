import { describe, expect, it } from "vitest";

import {
  validNoRouteResponse,
  validNotificationEvent,
  validResolvedResponse,
  validResolveRequest,
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

  it("keeps action URLs visible for integrators", () => {
    const response = parseResolveResponse(validNoRouteResponse);

    expect(isActionRequired(response)).toBe(true);
    expect(getActionUrl(response)).toBe("https://globalpayto.example/actions/setup/gptr_act_456");
  });

  it("guards Cubid comms notification payloads", () => {
    expect(isGlobalPayToNotification(validNotificationEvent)).toBe(true);
    expect(parseNotificationEvent(validNotificationEvent)).toEqual(validNotificationEvent);
  });
});
