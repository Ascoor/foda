import { useCallback, useEffect, useMemo } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Image as ImageIcon,
  Timer,
} from "lucide-react";

import type { Election } from "@/types";
import { useElections } from "@shared/api/elections.service";
import { useLanguage } from "@shared/contexts/LanguageContext";
import { cn, safeArray } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { Skeleton } from "@shared/ui/skeleton";
import { useCampaignsStore } from "@features/campaigns/store";

interface ElectionRibbonProps {
  campaignId: string;
  activeElectionId?: string | null;
  className?: string;
}

type PhaseState = "upcoming" | "running" | "closed";

type StatusConfig = {
  label: Record<"ar" | "en", string>;
  tone: string;
};

const statusCopy: Record<PhaseState, StatusConfig> = {
  upcoming: {
    label: { ar: "قادمة", en: "Upcoming" },
    tone: "border-warning/40 bg-warning/15 text-warning",
  },
  running: {
    label: { ar: "جارية", en: "Running" },
    tone: "border-success/40 bg-success/15 text-success",
  },
  closed: {
    label: { ar: "منتهية", en: "Closed" },
    tone: "border-muted/40 bg-muted/30 text-muted-foreground",
  },
};

const computePhaseState = (election: Election): PhaseState => {
  const now = Date.now();
  const phases = safeArray(election.phases)
    .map((phase) => ({
      start: new Date(phase.starts_at).getTime(),
      end: new Date(phase.ends_at).getTime(),
    }))
    .filter((phase) => Number.isFinite(phase.start) && Number.isFinite(phase.end));

  if (!phases.length) {
    return "upcoming";
  }

  const isRunning = phases.some((phase) => phase.start <= now && phase.end >= now);
  if (isRunning) return "running";

  const hasFuture = phases.some((phase) => phase.start > now);
  if (hasFuture) return "upcoming";

  return "closed";
};

const formatPhaseRange = (election: Election, language: "ar" | "en") => {
  const phases = safeArray(election.phases);
  if (!phases.length) return "";

  const first = phases[0];
  const last = phases[phases.length - 1];

  const locale = language === "ar" ? "ar-EG" : "en-GB";
  const start = first?.starts_at ? new Date(first.starts_at).toLocaleDateString(locale) : "";
  const end = last?.ends_at ? new Date(last.ends_at).toLocaleDateString(locale) : "";

  if (!start && !end) return "";
  if (!start || !end) return start || end;
  return `${start} – ${end}`;
};

const resolveCoverUrl = (election: Election) =>
  (election as Election & { coverUrl?: string; cover_url?: string; bannerUrl?: string })
    .coverUrl ??
  (election as Election & { cover_url?: string }).cover_url ??
  (election as Election & { bannerUrl?: string }).bannerUrl ??
  null;

export const ElectionRibbon = ({
  campaignId,
  activeElectionId: activeElectionIdProp,
  className,
}: ElectionRibbonProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const direction = language === "ar" ? "rtl" : "ltr";
  const { activeElectionId: storeActiveElectionId, setActiveElection } =
    useCampaignsStore();

  const activeElectionId = activeElectionIdProp ?? storeActiveElectionId;

  const { data, isPending } = useElections(campaignId);
  const elections = useMemo(() => safeArray(data), [data]);
  const activeIndex = useMemo(
    () =>
      elections.findIndex(
        (item) => item.id?.toString() === activeElectionId?.toString(),
      ),
    [elections, activeElectionId],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction,
    dragFree: true,
    containScroll: "trimSnaps",
    align: "start",
  });

  const canScrollPrev = elections.length > 0 && (activeIndex > 0 || activeIndex === -1);
  const canScrollNext =
    elections.length > 0 && (activeIndex === -1 || activeIndex < elections.length - 1);

  const scrollToElection = useCallback(
    (election: Election | undefined, behavior: "smooth" | "auto" = "smooth") => {
      if (!emblaApi || !election?.id) return;
      const electionId = election.id.toString();
      const index = elections.findIndex((item) => item.id?.toString() === electionId);
      if (index >= 0) {
        emblaApi.scrollTo(index, behavior === "auto");
      }
    },
    [emblaApi, elections],
  );

  const handleElectionChange = useCallback(
    (election: Election) => {
      const electionId = election.id?.toString();
      if (!campaignId || !electionId) return;
      if (activeElectionId && electionId === activeElectionId.toString()) {
        return;
      }

      setActiveElection(electionId);
      navigate(`/c/${campaignId}/e/${electionId}/dashboard`);
    },
    [activeElectionId, campaignId, navigate, setActiveElection],
  );

  useEffect(() => {
    if (!emblaApi || !activeElectionId) {
      return;
    }

    const target = elections.find(
      (item) => item.id?.toString() === activeElectionId.toString(),
    );

    if (target) {
      scrollToElection(target, "auto");
    }
  }, [emblaApi, elections, activeElectionId, scrollToElection]);

  const focusElectionByIndex = useCallback(
    (index: number) => {
      const target = elections[index];
      if (!target) return;
      handleElectionChange(target);
      scrollToElection(target);
    },
    [elections, handleElectionChange, scrollToElection],
  );

  const handlePrev = useCallback(() => {
    if (activeIndex === -1) {
      focusElectionByIndex(0);
      return;
    }

    const previousIndex = Math.max(0, activeIndex - 1);
    if (previousIndex !== activeIndex) {
      focusElectionByIndex(previousIndex);
    }
  }, [activeIndex, focusElectionByIndex]);

  const handleNext = useCallback(() => {
    if (!elections.length) return;
    if (activeIndex === -1) {
      focusElectionByIndex(0);
      return;
    }

    const nextIndex = Math.min(elections.length - 1, activeIndex + 1);
    if (nextIndex !== activeIndex) {
      focusElectionByIndex(nextIndex);
    }
  }, [activeIndex, elections.length, focusElectionByIndex]);

  const handleKeyNavigation = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, election: Election) => {
      if (!emblaApi) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleElectionChange(election);
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const currentIndex = elections.findIndex(
          (item) => item.id?.toString() === election.id?.toString(),
        );
        if (currentIndex < 0) return;
        const step = event.key === "ArrowRight" ? 1 : -1;
        const directionFactor = direction === "rtl" ? -1 : 1;
        const nextIndex = currentIndex + step * directionFactor;
        const nextElection = elections[nextIndex];
        if (nextElection) {
          handleElectionChange(nextElection);
          scrollToElection(nextElection);
        }
      }
    },
    [direction, elections, emblaApi, handleElectionChange, scrollToElection],
  );

  if (isPending) {
    return (
      <div
        className={cn(
          "glass-card relative mb-6 rounded-3xl border border-white/10 p-4",
          className,
        )}
      >
        <Skeleton className="h-[120px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!elections.length) {
    return (
      <div
        className={cn(
          "glass-card relative mb-6 flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/10 p-10 text-center",
          className,
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/30">
          <CircleDot className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {language === "ar"
            ? "لا توجد انتخابات مرتبطة بهذه الحملة بعد"
            : "No elections linked to this campaign yet."}
        </p>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "glass-card relative mb-6 rounded-3xl border border-white/10 p-5 shadow-lg",
        className,
      )}
      aria-label={language === "ar" ? "الانتخابات" : "Elections"}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {language === "ar" ? "الانتخابات المرتبطة" : "Linked elections"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === "ar"
              ? "اختر الانتخاب لتحديث لوحة التحكم"
              : "Choose an election to update the dashboard."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="glass-button h-9 w-9 rounded-full"
            onClick={handlePrev}
            disabled={!canScrollPrev}
            aria-label={language === "ar" ? "السابق" : "Previous election"}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="glass-button h-9 w-9 rounded-full"
            onClick={handleNext}
            disabled={!canScrollNext}
            aria-label={language === "ar" ? "التالي" : "Next election"}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden" dir={direction}>
        <div className="flex gap-4">
          <AnimatePresence initial={false}>
            {elections.map((election) => {
              const electionId = election.id?.toString() ?? "";
              const isActive =
                !!activeElectionId && electionId === activeElectionId.toString();
              const state = computePhaseState(election);
              const rangeLabel = formatPhaseRange(election, language);
              const coverUrl = resolveCoverUrl(election);

              return (
                <motion.button
                  key={electionId || election.name}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleElectionChange(election)}
                  onKeyDown={(event) => handleKeyNavigation(event, election)}
                  className={cn(
                    "group relative flex h-full min-w-[260px] shrink-0 flex-col gap-4 rounded-2xl border px-4 py-4 text-start transition-all focus-visible:outline-none",
                    isActive
                      ? "border-primary/80 bg-primary/10 shadow-[0_10px_30px_-15px_rgba(14,165,233,0.6)]"
                      : "border-white/10 bg-background/40 hover:border-primary/40 hover:bg-primary/5",
                  )}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  layout
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-muted/40">
                      {coverUrl ? (
                        <motion.img
                          key={coverUrl}
                          src={coverUrl}
                          alt={election.name}
                          className="h-full w-full object-cover"
                          initial={{ scale: 1.02, opacity: 0.85 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      {isActive && (
                        <motion.span
                          layout
                          className="absolute inset-0 rounded-2xl border-2 border-primary/70"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-foreground">
                          {election.name}
                        </h3>
                        <motion.span
                          layout
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                            statusCopy[state].tone,
                          )}
                        >
                          {statusCopy[state].label[language]}
                        </motion.span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {rangeLabel ||
                          (language === "ar"
                            ? "لم يتم تحديد المدى الزمني"
                            : "No time range defined yet")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {rangeLabel ||
                        (language === "ar" ? "غير محدد" : "Not specified")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {state === "running" ? (
                        <Timer className="h-3.5 w-3.5" />
                      ) : (
                        <CircleDot className="h-3.5 w-3.5" />
                      )}
                      {statusCopy[state].label[language]}
                    </span>
                  </div>

                  <motion.span
                    layoutId="election-focus-ring"
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-2xl border-2",
                      isActive ? "border-primary/80" : "border-transparent",
                    )}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
