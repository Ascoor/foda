import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderPlus,
  PlayCircle,
} from "lucide-react";

import { Campaign } from "@/services/campaignService";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

interface CampaignPickerProps {
  campaigns: Campaign[];
  direction: "rtl" | "ltr";
  selectedCampaignId: string;
  onSelect: (campaign: Campaign) => void;
  onContinue: (campaign: Campaign) => void;
  onRequestCreate: () => void;
  isCreating?: boolean;
}

const motionVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 64 : -64,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -64 : 64,
    opacity: 0,
    scale: 0.96,
  }),
};

const indicatorClasses =
  "h-1 rounded-full transition-all duration-300 bg-gradient-to-r from-primary/80 to-accent";

const formatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const CampaignPicker = ({
  campaigns,
  direction,
  selectedCampaignId,
  onSelect,
  onContinue,
  onRequestCreate,
  isCreating = false,
}: CampaignPickerProps) => {
  const [index, setIndex] = useState(() =>
    Math.max(
      campaigns.findIndex((campaign) => campaign.id === selectedCampaignId),
      0,
    ),
  );
  const [transitionDirection, setTransitionDirection] = useState(0);

  const activeCampaign = campaigns[index] ?? campaigns[0];

  const previousDisabled = campaigns.length <= 1;
  const nextDisabled = campaigns.length <= 1;

  const iconDirection = useMemo(
    () => ({
      prev: direction === "rtl" ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />,
      next: direction === "rtl" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />,
    }),
    [direction],
  );

  const handleStep = (step: number) => {
    if (campaigns.length <= 1) return;
    setIndex((current) => {
      const nextIndex = (current + step + campaigns.length) % campaigns.length;
      setTransitionDirection(Math.sign(step));
      const selected = campaigns[nextIndex];
      if (selected) {
        onSelect(selected);
      }
      return nextIndex;
    });
  };

  const thumbnails = useMemo(
    () =>
      campaigns.map((campaign) => ({
        ...campaign,
        formattedDate: formatter.format(new Date(campaign.created_at)),
      })),
    [campaigns],
  );

  useEffect(() => {
    if (!campaigns.length) return;
    const nextIndex = Math.max(
      campaigns.findIndex((campaign) => campaign.id === selectedCampaignId),
      0,
    );
    setIndex(nextIndex);
  }, [campaigns, selectedCampaignId]);

  if (!campaigns.length) {
    return null;
  }

  return (
    <Card className="glass-card relative overflow-hidden border-white/20 bg-gradient-to-br from-background/80 via-background/40 to-background/80">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-2xl font-semibold text-foreground">
          {direction === "rtl" ? "اختر حملتك الحالية" : "Pick your current campaign"}
        </CardTitle>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="ghost"
            className="glass-button min-h-11 px-4"
            onClick={() => handleStep(direction === "rtl" ? 1 : -1)}
            disabled={previousDisabled}
            aria-label={direction === "rtl" ? "الحملة التالية" : "Previous campaign"}
          >
            {iconDirection.prev}
          </Button>
          <Button
            variant="ghost"
            className="glass-button min-h-11 px-4"
            onClick={() => handleStep(direction === "rtl" ? -1 : 1)}
            disabled={nextDisabled}
            aria-label={direction === "rtl" ? "الحملة السابقة" : "Next campaign"}
          >
            {iconDirection.next}
          </Button>
          <Button
            variant="glass"
            className="min-h-11 px-6"
            onClick={onRequestCreate}
            disabled={isCreating}
          >
            <FolderPlus className="size-5" />
            {direction === "rtl" ? "إضافة حملة" : "New campaign"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div dir={direction} className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/60 p-6 shadow-inner">
          <AnimatePresence mode="wait" initial={false} custom={transitionDirection}>
            {activeCampaign && (
              <motion.div
                key={activeCampaign.id}
                custom={transitionDirection}
                variants={motionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid gap-4 text-start md:grid-cols-[1fr_auto] md:items-center"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {activeCampaign.name}
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    {direction === "rtl" ? "تاريخ الإنشاء" : "Created"}: {formatter.format(new Date(activeCampaign.created_at))}
                  </p>
                </div>
                <Button
                  variant="floating"
                  size="lg"
                  className="min-h-12"
                  onClick={() => onContinue(activeCampaign)}
                >
                  <PlayCircle className="size-5" />
                  {direction === "rtl" ? "متابعة الحملة" : "Continue"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "flex items-stretch gap-4 overflow-x-auto pb-2",
            direction === "rtl" ? "flex-row-reverse" : "",
          )}
          dir={direction}
        >
          {thumbnails.map((campaign) => {
            const isActive = campaign.id === activeCampaign?.id;
            return (
              <button
                key={campaign.id}
                type="button"
                onClick={() => {
                  const nextIndex = campaigns.findIndex((item) => item.id === campaign.id);
                  if (nextIndex !== -1) {
                    const delta = nextIndex - index;
                    setTransitionDirection(Math.sign(delta));
                    setIndex(nextIndex);
                    const selected = campaigns[nextIndex];
                    if (selected) {
                      onSelect(selected);
                    }
                  }
                }}
                className={cn(
                  "group relative min-w-[12rem] rounded-2xl border border-transparent bg-white/5 p-4 text-start transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                  isActive && "border-primary/80 shadow-glow backdrop-blur-md",
                )}
                aria-pressed={isActive}
              >
                <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {campaign.name}
                </span>
                <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3" />
                  {campaign.formattedDate}
                </span>
                <span
                  className={cn(
                    "absolute bottom-2 left-4 right-4 opacity-0 group-hover:opacity-100",
                    isActive && "opacity-100",
                  )}
                >
                  <span className={indicatorClasses} />
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
