import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CircleDot, Timer } from "lucide-react";

import type { Election } from "@/types";
import { useLanguage } from "@shared/contexts/LanguageContext";
import { cn, safeArray } from "@shared/lib/utils";
import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import { Badge } from "@shared/ui/badge";
import { Skeleton } from "@shared/ui/skeleton";
import { fetchCampaignElections } from "../api";
import { useCampaignsStore } from "../store";

interface ElectionRibbonProps {
  campaignId: string;
  activeElectionId?: string | null;
}

type PhaseState = "upcoming" | "running" | "closed";

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

  const hasFuture = phases.some((phase) => phase.start > now);
  const isRunning = phases.some((phase) => phase.start <= now && phase.end >= now);

  if (isRunning) return "running";
  if (hasFuture) return "upcoming";
  return "closed";
};

const statusCopy: Record<PhaseState, { label: Record<string, string>; tone: string }> = {
  upcoming: {
    label: { ar: "قادمة", en: "Upcoming" },
    tone: "bg-warning/15 text-warning border-warning/30",
  },
  running: {
    label: { ar: "جارية", en: "Running" },
    tone: "bg-success/15 text-success border-success/30",
  },
  closed: {
    label: { ar: "منتهية", en: "Closed" },
    tone: "bg-muted/60 text-muted-foreground border-muted/40",
  },
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

export const ElectionRibbon = ({ campaignId, activeElectionId }: ElectionRibbonProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { setActiveElection } = useCampaignsStore();

  const { data, isLoading } = useQuery({
    queryKey: ["campaign", campaignId, "elections"],
    queryFn: () => fetchCampaignElections(campaignId),
    enabled: !!campaignId,
  });

  const elections = useMemo(() => safeArray(data), [data]);

  const handleNavigate = (election: Election) => {
    const campaignSegment = campaignId;
    const electionSegment = election.id?.toString();
    if (!campaignSegment || !electionSegment) return;

    setActiveElection(electionSegment);
    navigate(`/c/${campaignSegment}/e/${electionSegment}/dashboard`);
  };

  if (isLoading) {
    return (
      <div className="glass-card mb-6 flex items-center gap-3 rounded-3xl border border-white/10 p-4">
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!elections.length) {
    return null;
  }

  return (
    <div className="glass-card mb-6 rounded-3xl border border-white/10 p-4 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {language === "ar" ? "الانتخابات المرتبطة" : "Linked elections"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === "ar"
              ? "اختر الانتخاب لعرض لوحة التحكم الخاصة به"
              : "Select an election to view its dedicated dashboard."}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        <AnimatePresence initial={false}>
          {elections.map((election) => {
            const state = computePhaseState(election);
            const rangeLabel = formatPhaseRange(election, language);
            const isActive = election.id?.toString() === activeElectionId?.toString();
            const initials = election.name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("");

            return (
              <motion.button
                key={election.id}
                layout
                type="button"
                onClick={() => handleNavigate(election)}
                className={cn(
                  "group flex min-w-[240px] flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-all",
                  isActive
                    ? "border-primary/60 bg-primary/10 shadow-primary/20"
                    : "border-white/10 bg-background/40 hover:border-primary/40 hover:bg-primary/5",
                )}
              >
                <Avatar className="h-12 w-12 border border-white/20 bg-primary/10 text-primary">
                  <AvatarFallback className="text-sm font-semibold">
                    {initials || "EV"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {election.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "border text-xs font-medium",
                        statusCopy[state].tone,
                      )}
                    >
                      {statusCopy[state].label[language]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {rangeLabel || (language === "ar" ? "لم يتم التحديد" : "Not specified")}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {state === "running" ? (
                        <Timer className="h-3.5 w-3.5" />
                      ) : (
                        <CircleDot className="h-3.5 w-3.5" />
                      )}
                      {language === "ar"
                        ? `${statusCopy[state].label[language]}`
                        : statusCopy[state].label[language]}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
