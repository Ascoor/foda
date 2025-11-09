import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "@/features/legacy/hooks/useAuth";
import FloatingLandingPage from "@/features/modules/marketing/pages/LandingPage";
import { getNavTree } from "@/routing/nav/nav.map";
import { useNavigationContext } from "@/routing/nav/useNavigationContext";
import { useCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";

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
  const { setCampaignId } = useCampaignContext();

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

    setCampaignId(null);

    const returnToParam = sanitizePath(params.get("returnTo"));
    const stateReturnTo = sanitizePath(
      (location.state as { returnTo?: string } | undefined)?.returnTo,
    );

    const target = returnToParam ?? stateReturnTo ?? defaultDestination;
    const params = new URLSearchParams();
    params.set("returnTo", target);

    navigate(`/campaign-gateway?${params.toString()}`, {
      replace: true,
      state: { returnTo: target },
    });
  }, [
    defaultDestination,
    isAuthenticated,
    loading,
    location.state,
    navigate,
    params,
    setCampaignId,
  ]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <FloatingLandingPage />;
  }

  return null;
};

export default PostAuthRedirect;
