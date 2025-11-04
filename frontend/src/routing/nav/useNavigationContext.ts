import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "@/features/legacy/hooks/useAuth";
import { useFeatureFlags } from "@/infrastructure/shared/contexts/FeatureFlagContext";
import { useWindowSize } from "@/infrastructure/shared/hooks/useWindowSize";

import { createNavigationContext, getBreadcrumbTrail, getNavTree } from "./nav.map";
import type { FeatureFlag, NavigationContext, NavSurface, Role } from "./nav.schema";

const DESKTOP_BREAKPOINT = 1024;

const normaliseRole = (roles?: string[]): Role | null => {
  if (!roles || roles.length === 0) {
    return null;
  }

  const canonical = roles
    .map((role) => role.toLowerCase().trim())
    .find((role) => ["admin", "manager", "staff", "guest"].includes(role));

  if (canonical) {
    return canonical as Role;
  }

  const primary = roles[0]?.toLowerCase().replace(/\s+/g, "-") ?? null;
  return (primary as Role) ?? null;
};

const detectReadonly = (roles?: { name?: string | null }[]): boolean =>
  Boolean(
    roles?.some((role) =>
      String(role?.name ?? "")
        .toLowerCase()
        .includes("read-only"),
    ),
  );

export const useNavigationContext = (): NavigationContext => {
  const { user, isAuthenticated } = useAuth();
  const { flags } = useFeatureFlags();
  const { width } = useWindowSize();

  const role = normaliseRole(user?.roleNames);
  const auth = isAuthenticated ? "authenticated" : "unauthenticated";
  const device = width < DESKTOP_BREAKPOINT ? "mobile" : "desktop";
  const readonly = detectReadonly(user?.roles);

  const sortedFlags = useMemo(() => {
    const arr = Array.from(flags.values()) as FeatureFlag[];
    return arr.sort();
  }, [flags]);
  const flagSignature = sortedFlags.join("|");

  return useMemo(
    () =>
      createNavigationContext({
        role,
        auth,
        device,
        readonly,
        flags: new Set(sortedFlags),
      }),
    [auth, device, flagSignature, readonly, role],
  );
};

export const useNavTree = (surface?: NavSurface) => {
  const ctx = useNavigationContext();
  return useMemo(() => getNavTree(ctx, surface ? { surface } : {}), [ctx, surface]);
};

export const useNavBreadcrumbs = () => {
  const ctx = useNavigationContext();
  const location = useLocation();
  return useMemo(() => getBreadcrumbTrail(location.pathname, ctx), [ctx, location.pathname]);
};
