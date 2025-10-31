import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { useLanguage } from "@shared/contexts/LanguageContext";
import { safeArray } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { EmptyState } from "@shared/ui/data-table-skeleton";
import { Skeleton } from "@shared/ui/skeleton";
import { CampaignsCarousel } from "@features/campaigns/components/CampaignsCarousel";
import { CreateCampaignDialog } from "@features/campaigns/components/CreateCampaignDialog";
import { useCampaignsStore } from "@features/campaigns/store";
import { fetchCampaigns } from "@features/campaigns/api";
import type { Campaign } from "@/types";

export const CampaignsIndex = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { activeCampaignId, setActiveCampaign, setActiveElection } = useCampaignsStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => fetchCampaigns({ include: "statistics" }),
    staleTime: 1000 * 60 * 5,
  });

  const campaigns = safeArray(data?.data ?? data) as Campaign[];

  const handleCampaignSelect = (campaign: Campaign) => {
    const campaignId = campaign.id?.toString();
    if (!campaignId) return;

    setActiveCampaign(campaignId);
    setActiveElection(null);
    navigate(`/c/${campaignId}/dashboard`);
  };

  const handleCreateSuccess = (campaign: Campaign) => {
    handleCampaignSelect(campaign);
  };

  const emptyState = !isLoading && campaigns.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3 text-center sm:text-left">
          <motion.h1
            layout
            className="text-3xl font-bold tracking-tight text-gradient-primary sm:text-4xl"
          >
            {language === "ar" ? "حملاتك الانتخابية" : "Your election campaigns"}
          </motion.h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {language === "ar"
              ? "اختر حملة لمتابعة الأداء أو أنشئ حملة جديدة وحدد نطاقها الجغرافي"
              : "Pick a campaign to explore performance or launch a new one with a defined geographic context."}
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
              className="glass-button border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
            >
              {language === "ar" ? "إنشاء حملة" : "Create campaign"}
            </Button>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : emptyState ? (
          <div className="glass-card flex flex-col items-center justify-center rounded-3xl border border-white/10 p-10 text-center shadow-lg">
            <EmptyState
              title={language === "ar" ? "لا توجد حملات" : "No campaigns yet"}
              description={
                language === "ar"
                  ? "ابدأ حملتك الأولى واختر نطاقها الجغرافي"
                  : "Start your first campaign and connect it to a geographic scope."
              }
              action={
                <Button
                  className="mt-4 bg-gradient-primary text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  {language === "ar" ? "إنشاء حملة" : "Create campaign"}
                </Button>
              }
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <CampaignsCarousel
              campaigns={campaigns}
              activeCampaignId={activeCampaignId}
              onSelectCampaign={handleCampaignSelect}
              onCreateCampaign={() => setIsDialogOpen(true)}
              isLoading={isLoading}
            />
          </AnimatePresence>
        )}
      </div>

      <CreateCampaignDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default CampaignsIndex;
