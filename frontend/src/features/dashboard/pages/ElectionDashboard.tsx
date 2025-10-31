import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { useLanguage } from "@shared/contexts/LanguageContext";
import { safeArray } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { Skeleton } from "@shared/ui/skeleton";
import { fetchCampaign } from "@features/campaigns/api";
import { useCampaignsStore } from "@features/campaigns/store";
import { ElectionRibbon } from "@features/dashboard/components/ElectionRibbon";
import { EnhancedDashboard } from "@features/dashboard/EnhancedDashboard";
import { useElections } from "@shared/api/elections.service";
import type { Campaign, Election } from "@/types";

export const ElectionDashboard = () => {
  const navigate = useNavigate();
  const params = useParams<Record<string, string | undefined>>();
  const routeCampaignId = params.campaignId ?? params.id ?? "";
  const routeElectionId = params.electionId ?? params.eid ?? "";
  const { language } = useLanguage();
  const {
    activeElectionId,
    setActiveCampaign,
    setActiveElection,
  } = useCampaignsStore();

  useEffect(() => {
    if (routeCampaignId) {
      setActiveCampaign(routeCampaignId);
    }
  }, [routeCampaignId, setActiveCampaign]);

  useEffect(() => {
    if (routeElectionId) {
      setActiveElection(routeElectionId);
    }
  }, [routeElectionId, setActiveElection]);

  useEffect(() => {
    if (!routeCampaignId) {
      navigate("/campaigns", { replace: true });
    }
  }, [navigate, routeCampaignId]);

  const { data: campaign, isLoading: isCampaignLoading } = useQuery<Campaign>({
    queryKey: ["campaign", routeCampaignId],
    queryFn: () => fetchCampaign(routeCampaignId),
    enabled: !!routeCampaignId,
  });

  const { data: electionsData, isLoading: isElectionsLoading } =
    useElections(routeCampaignId);

  const elections = useMemo(() => safeArray<Election>(electionsData), [electionsData]);
  const fallbackElectionId = elections[0]?.id?.toString() ?? null;
  const effectiveElectionId =
    routeElectionId || activeElectionId || fallbackElectionId || null;

  useEffect(() => {
    if (!routeCampaignId || !elections.length) {
      return;
    }

    if (!routeElectionId && effectiveElectionId) {
      setActiveElection(effectiveElectionId);
      navigate(`/c/${routeCampaignId}/e/${effectiveElectionId}/dashboard`, {
        replace: true,
      });
    }
  }, [
    activeElectionId,
    effectiveElectionId,
    elections,
    navigate,
    routeCampaignId,
    routeElectionId,
    setActiveElection,
  ]);

  const heroTitle = language === "ar" ? "لوحة تحكم الحملة" : "Campaign dashboard";
  const heroSubtitle = language === "ar"
    ? "تابع أداء الحملة والانتخابات المرتبطة بها"
    : "Monitor campaign performance and linked elections.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="glass-button inline-flex items-center gap-2"
              onClick={() => navigate("/campaigns")}
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "ar" ? "العودة للحملات" : "Back to campaigns"}
            </Button>
            {isCampaignLoading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">
                  {campaign?.name ?? heroTitle}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  {campaign?.description ?? heroSubtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        {routeCampaignId ? (
          <ElectionRibbon
            campaignId={routeCampaignId}
            activeElectionId={effectiveElectionId}
            className={isElectionsLoading ? "opacity-50" : undefined}
          />
        ) : null}

        <EnhancedDashboard
          campaignId={routeCampaignId || null}
          electionId={effectiveElectionId}
        />
      </div>
    </div>
  );
};
