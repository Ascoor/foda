import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "@legacy/hooks/useAuth";
import FloatingLandingPage from "@features/marketing/pages/LandingPage";
import { getNavTree } from "@/nav/nav.map";
import { useNavigationContext } from "@/nav/useNavigationContext";

const sanitizePath = (candidate: unknown): string | null => {
  if (typeof candidate !== "string") return null;
  if (!candidate.startsWith("/")) return null;
  return candidate;
};

export const PostAuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const navContext = useNavigationContext();

  const defaultDestination = useMemo(() => {
    const tree = getNavTree(navContext, { surface: "sidebar" });
    const stack = [...tree];
    while (stack.length) {
      const node = stack.shift();
      if (node?.path) {
        return node.path;
      }
      if (node?.children) {
        stack.unshift(...(node.children as typeof stack));
      }
    }
    return "/reports";
  }, [navContext]);

  useEffect(() => {
    if (loading || !isAuthenticated) {
      return;
    }

    const returnToParam = sanitizePath(params.get("returnTo"));
    const stateReturnTo = sanitizePath(
      (location.state as { returnTo?: string } | undefined)?.returnTo,
    );

    const target = returnToParam ?? stateReturnTo ?? defaultDestination;

    navigate(target, { replace: true, state: undefined });
  }, [defaultDestination, isAuthenticated, loading, location.state, navigate, params]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <FloatingLandingPage />;
  }

  return null;
};

export default PostAuthRedirect;
