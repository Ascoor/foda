import { type ReactNode, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOptionalCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";

interface CampaignGuardProps {
  children: ReactNode;
}

export const CampaignGuard = ({ children }: CampaignGuardProps) => {
  const campaignContext = useOptionalCampaignContext();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams();
    params.set(
      "returnTo",
      `${location.pathname}${location.search || ""}`.replace(/\/{2,}/g, "/"),
    );
    return `/campaign-gateway?${params.toString()}`;
  }, [location.pathname, location.search]);

  // If the provider hasn't mounted yet or context is unavailable, don't render (avoids flicker).
  if (!campaignContext) return null;

  const { campaignId } = campaignContext;

  if (!campaignId) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ returnTo: `${location.pathname}${location.search || ""}` }}
      />
    );
  }

  return <>{children}</>;
};

export default CampaignGuard;
