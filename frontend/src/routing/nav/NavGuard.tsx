import { type ReactNode, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { canAccessPath, findRouteMatch } from "./nav.map";
import type { NavNode } from "./nav.schema";
import { useNavigationContext } from "./useNavigationContext";

const collectAncestorIds = (node: NavNode | null | undefined): string[] => {
  const ids: string[] = [];
  let current = node?.parent;
  while (current) {
    ids.push(current.id);
    current = current.parent ?? undefined;
  }
  return ids;
};

interface NavGuardProps {
  children: ReactNode;
  path?: string;
  itemId?: string;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const NavGuard = ({
  children,
  path,
  itemId,
  fallback,
  redirectTo = "/dashboard",
}: NavGuardProps) => {
  const ctx = useNavigationContext();
  const location = useLocation();
  const targetPath = path ?? location.pathname;

  const allowed = useMemo(() => {
    if (itemId) {
      const match = findRouteMatch(targetPath, ctx);
      if (!match) return false;
      if (match.id === itemId) return true;
      const ancestors = collectAncestorIds(match.node);
      return ancestors.includes(itemId);
    }
    return canAccessPath(targetPath, ctx);
  }, [ctx, itemId, targetPath]);

  if (!allowed) {
    if (location.pathname === redirectTo) return null; // منع حلقة إعادة التوجيه
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  

  return <>{children}</>;
};

export default NavGuard;
