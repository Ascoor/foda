import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  canAccessPath,
  clearNavTelemetryHandlers,
  createNavigationContext,
  getBreadcrumbTrail,
  getNavTree,
  getSurfaceNav,
  subscribeToNavTelemetry,
} from "../nav.map";

const adminContext = createNavigationContext({
  role: "admin",
  auth: "authenticated",
  flags: new Set(),
});

const staffContext = createNavigationContext({
  role: "staff",
  auth: "authenticated",
  flags: new Set(),
});

const guestContext = createNavigationContext({
  role: null,
  auth: "unauthenticated",
  flags: new Set(),
});

describe("navigation mapping", () => {
  beforeEach(() => {
    clearNavTelemetryHandlers();
  });

  it("returns ordered sidebar items for admin", () => {
    const sidebar = getSurfaceNav(adminContext, "sidebar");
    expect(sidebar.map((node) => node.id)).toEqual([
      "dashboard",
      "reports",
      "operations",
      "field",
      "campaign",
      "admin",
    ]);
  });

  it("hides role-gated entries for guests", () => {
    const sidebar = getSurfaceNav(guestContext, "sidebar");
    expect(sidebar.map((node) => node.id)).not.toContain("reports");
    expect(sidebar.map((node) => node.id)).toContain("operations");
  });

  it("only shows flag-gated analytics when flag is enabled", () => {
    const topWithoutFlag = getSurfaceNav(adminContext, "top");
    const analyticsParentWithoutFlag = topWithoutFlag.find(
      (node) => node.id === "campaign",
    );
    expect(
      analyticsParentWithoutFlag?.children?.some(
        (child) => child.id === "campaign.analytics",
      ),
    ).toBeFalsy();

    const flaggedContext = createNavigationContext({
      role: "admin",
      auth: "authenticated",
      flags: new Set(["betaReports"]),
    });

    const topWithFlag = getSurfaceNav(flaggedContext, "top");
    const analyticsParent = topWithFlag.find((node) => node.id === "campaign");
    expect(
      analyticsParent?.children?.some(
        (child) => child.id === "campaign.analytics",
      ),
    ).toBe(true);
  });

  it("emits telemetry for guard checks", () => {
    const handler = vi.fn();
    subscribeToNavTelemetry(handler);

    const allowed = canAccessPath("/reports", adminContext);
    const denied = canAccessPath("/reports", guestContext);

    expect(allowed).toBe(true);
    expect(denied).toBe(false);
    expect(handler).toHaveBeenCalledTimes(2);

    const [firstEvent, secondEvent] = handler.mock.calls.map((call) => call[0]);
    expect(firstEvent.type).toBe("nav:guard");
    expect(firstEvent.allowed).toBe(true);
    expect(secondEvent.allowed).toBe(false);
  });

  it("produces breadcrumbs for deep routes", () => {
    const breadcrumbs = getBreadcrumbTrail("/elections/123", staffContext);
    expect(breadcrumbs.map((crumb) => crumb.id)).toEqual([
      "operations.elections",
      "operations.elections.detail",
    ]);
  });

  it("matches snapshot for sidebar contexts", () => {
    expect(getNavTree(adminContext, { surface: "sidebar" })).toMatchSnapshot();
    expect(getNavTree(staffContext, { surface: "sidebar" })).toMatchSnapshot();
    const mobileContext = createNavigationContext({
      role: "staff",
      device: "mobile",
      auth: "authenticated",
      flags: new Set(),
    });
    expect(getNavTree(mobileContext, { surface: "sidebar" })).toMatchSnapshot();
  });
});
