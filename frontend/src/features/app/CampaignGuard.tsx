import { type ReactNode, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";

import {
  useCampaignContext,
  useOptionalCampaignContext,
} from "@/infrastructure/shared/contexts/CampaignContext";

interface CampaignGuardProps {
  children: ReactNode;
}

export const CampaignGuard = ({ children }: CampaignGuardProps) => {
  const optionalContext = useOptionalCampaignContext();
  const { campaignId } = optionalContext ?? useCampaignContext();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams();
    params.set(
      "returnTo",
      `${location.pathname}${location.search ?? ""}`.replace(/\/{2,}/g, "/"),
    );
    return `/campaign-gateway?${params.toString()}`;
  }, [location.pathname, location.search]);

  if (!campaignId) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ returnTo: `${location.pathname}${location.search ?? ""}` }}
      />
    );
  }

  return <>{children}</>;
};

export default CampaignGuard;
