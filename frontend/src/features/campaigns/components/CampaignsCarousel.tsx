import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import type { Campaign } from "@/types";
import { useLanguage } from "@shared/contexts/LanguageContext";
import { cn, safeArray } from "@shared/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@shared/ui/carousel";
import { Button } from "@shared/ui/button";
import { CampaignCard } from "./CampaignCard";

interface CampaignsCarouselProps {
  campaigns?: Campaign[];
  activeCampaignId?: string | null;
  onSelectCampaign?: (campaign: Campaign) => void;
  onCreateCampaign?: () => void;
  isLoading?: boolean;
}

export const CampaignsCarousel = ({
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onCreateCampaign,
  isLoading = false,
}: CampaignsCarouselProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { direction, language } = useLanguage();

  const normalizedCampaigns = useMemo(
    () => safeArray(campaigns),
    [campaigns],
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const elements = Array.from(
        node.querySelectorAll<HTMLButtonElement>("[data-campaign-id]"),
      );
      if (!elements.length) return;

      const currentIndex = elements.findIndex((element) =>
        element.dataset.active === "true",
      );

      const nextIndex =
        currentIndex === -1
          ? 0
          : (currentIndex + delta + elements.length) % elements.length;

      elements[nextIndex]?.focus();
      elements[nextIndex]?.click();
    };

    node.addEventListener("keydown", handleKeyDown);
    return () => node.removeEventListener("keydown", handleKeyDown);
  }, [normalizedCampaigns.length]);

  return (
    <div
      ref={containerRef}
      className="relative"
      tabIndex={0}
      dir={direction}
      aria-label="campaigns-carousel"
    >
      <Carousel
        opts={{
          align: "start",
          direction: direction === "rtl" ? "rtl" : "ltr",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="mt-6 -ml-2 px-2 md:-ml-4 md:px-4">
          <AnimatePresence initial={false}>
            {normalizedCampaigns.map((campaign) => (
              <CarouselItem
                key={campaign.id}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                {(() => {
                  const isActive =
                    (campaign.id?.toString() ?? "") ===
                    activeCampaignId?.toString();

                  return (
                    <button
                      type="button"
                      className="flex h-full w-full focus:outline-none"
                      data-campaign-id={campaign.id}
                      data-active={isActive ? "true" : "false"}
                      onClick={() => onSelectCampaign?.(campaign)}
                    >
                      <CampaignCard
                        campaign={campaign}
                        isActive={isActive}
                        locale={language === "ar" ? "ar" : "en"}
                      />
                    </button>
                  );
                })()}
              </CarouselItem>
            ))}
          </AnimatePresence>

          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <motion.div
              layout
              className="glass-card flex h-full min-h-[260px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-primary/40 bg-gradient-to-br from-primary/5 via-background/60 to-background/30 p-6 text-center"
            >
              <Button
                variant="outline"
                onClick={onCreateCampaign}
                className="glass-button flex items-center gap-2 rounded-full border-primary/40 bg-primary/10 px-6 text-primary hover:bg-primary/20"
              >
                <Plus className="h-4 w-4" />
                {language === "ar" ? "إنشاء حملة" : "Create campaign"}
              </Button>
              <p className="max-w-[220px] text-sm text-muted-foreground">
                {language === "ar"
                  ? "ابدأ حملة جديدة وحدد نطاقك الجغرافي"
                  : "Start a new campaign and configure its geographic scope."}
              </p>
            </motion.div>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious className={cn("-left-12 hidden md:flex", isLoading && "opacity-50")}
          disabled={isLoading}
        />
        <CarouselNext className={cn("-right-12 hidden md:flex", isLoading && "opacity-50")}
          disabled={isLoading}
        />
      </Carousel>
    </div>
  );
};
