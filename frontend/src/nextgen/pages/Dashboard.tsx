import { useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, UserCheck, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuroraBackground } from "../components/ui/AuroraBackground";
import {
  Header,
  Sidebar,
  DashboardContent,
  FloatingActions,
  useFloatingExperienceStore,
  type OverviewCard,
} from "../components/layout";
import { useApi } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { toast } from "@/hooks/use-toast";
import { safeArray, safeNumber } from "@/lib/safeData";
import type { DistributionSlice } from "../components/layout/charts/PieChart";
import type { TurnoutPoint } from "../components/layout/charts/LineChart";
import type { TrendPoint } from "../components/layout/charts/AreaChart";
import type { BarSegment } from "../components/layout/charts/BarChart";
import type { MapPoint } from "../components/layout/MapSection";
import "../components/layout/i18n";

type DashboardStatsEntry = {
  value?: unknown;
  change?: unknown;
  trend?: unknown;
};

type DashboardStats = Record<string, DashboardStatsEntry>;

type DashboardActivity = {
  type?: unknown;
};

type DashboardRegistration = {
  month?: unknown;
  count?: unknown;
};

type DashboardProgress = {
  registration?: unknown;
  verification?: unknown;
  campaign?: unknown;
  voting?: unknown;
  overall?: unknown;
  remaining?: unknown;
};

type DashboardPayload = {
  stats?: DashboardStats;
  activities?: DashboardActivity[];
  progress?: DashboardProgress;
  turnout?: Array<number | { value?: unknown; label?: unknown; momentum?: unknown }>;
  registrations?: DashboardRegistration[];
  areas?: unknown;
  volunteers?: unknown;
  voters?: unknown;
  teams?: unknown;
  events?: unknown;
};

type DashboardResponse = DashboardPayload | { data?: DashboardPayload };

type HeatmapResponse = { data?: Array<{ lat?: unknown; lng?: unknown }> } | Array<{ lat?: unknown; lng?: unknown }>;

export const FloatingDashboard = () => {
  const { theme, language } = useFloatingExperienceStore();
  const { t } = useTranslation("floating");

  const {
    data: dashboardRaw,
    loading: dashboardLoading,
    error: dashboardError,
    execute: fetchDashboard,
  } = useApi<DashboardResponse>({ url: API_ENDPOINTS.dashboard.overview, method: "GET" });

  const {
    data: heatmapRaw,
    loading: heatmapLoading,
    error: heatmapError,
    execute: fetchHeatmap,
  } = useApi<HeatmapResponse>({ url: API_ENDPOINTS.dashboard.heatmap, method: "GET" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    fetchDashboard()
      .then(() => toast({ description: t("dashboard.loadSuccess", "تم تحديث بيانات لوحة التحكم") }))
      .catch(() => toast({ variant: "destructive", description: t("dashboard.loadError", "تعذر تحميل بيانات لوحة التحكم") }));

    fetchHeatmap().catch(() =>
      toast({ variant: "destructive", description: t("dashboard.heatmapError", "تعذر تحميل بيانات الخريطة") }),
    );
  }, [fetchDashboard, fetchHeatmap, t]);

  const dashboardPayload: DashboardPayload = useMemo(() => {
    if (!dashboardRaw || typeof dashboardRaw !== "object") {
      return {};
    }

    if ("data" in dashboardRaw && dashboardRaw.data && typeof dashboardRaw.data === "object") {
      return dashboardRaw.data as DashboardPayload;
    }

    return dashboardRaw as DashboardPayload;
  }, [dashboardRaw]);

  const statsRecord: DashboardStats = useMemo(() => {
    const candidate = dashboardPayload?.stats;
    return candidate && typeof candidate === "object" ? (candidate as DashboardStats) : {};
  }, [dashboardPayload?.stats]);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
        maximumFractionDigits: 1,
      }),
    [language],
  );

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
        month: "short",
        year: "numeric",
      }),
    [language],
  );

  const turnoutSeries = useMemo(() => {
    const rawTurnout = dashboardPayload?.turnout ?? [];
    return safeArray(rawTurnout as Array<number | Record<string, unknown>>).map((entry, index) => {
      if (typeof entry === "number") {
        return { value: entry };
      }

      const value = safeNumber((entry as { value?: unknown }).value);
      const label = (entry as { label?: unknown }).label;
      const momentum = safeNumber((entry as { momentum?: unknown }).momentum);

      return {
        value,
        label: typeof label === "string" ? label : undefined,
        momentum,
      };
    });
  }, [dashboardPayload?.turnout]);

  const averageTurnout = useMemo(() => {
    if (!turnoutSeries.length) return 0;
    const total = turnoutSeries.reduce((sum, entry) => sum + safeNumber(entry.value), 0);
    return total / turnoutSeries.length;
  }, [turnoutSeries]);

  const turnoutChange = useMemo(() => {
    if (turnoutSeries.length < 2) return 0;
    const last = safeNumber(turnoutSeries[turnoutSeries.length - 1]?.value);
    const previous = safeNumber(turnoutSeries[turnoutSeries.length - 2]?.value);
    return last - previous;
  }, [turnoutSeries]);

  const overviewCards: OverviewCard[] = useMemo(() => {
    const cards: OverviewCard[] = [];

    const getStatDetails = (key: string, fallback?: keyof DashboardPayload) => {
      const stat = statsRecord[key];
      const value = safeNumber((stat as { value?: unknown })?.value ?? (fallback ? dashboardPayload?.[fallback] : 0));
      const change = typeof (stat as { change?: unknown })?.change === "string" ? (stat as { change: string }).change : undefined;
      return { value, change };
    };

    const participationChange = statsRecord?.participation
      ? (statsRecord.participation.change as string | undefined)
      : undefined;

    const participationValue = Number.isFinite(averageTurnout)
      ? `${averageTurnout.toFixed(1)}%`
      : numberFormatter.format(0);

    const computedChange = participationChange
      ? participationChange
      : turnoutChange
        ? `${turnoutChange > 0 ? "+" : ""}${turnoutChange.toFixed(1)}%`
        : undefined;

    cards.push({
      id: "participation",
      title: t("dashboard.cards.participation", "نسبة المشاركة"),
      value: participationValue,
      change: computedChange,
      icon: TrendingUp,
      gradient: "from-emerald-400/80 to-cyan-400/70",
    });

    const votersStat = getStatDetails("active_voters", "voters");
    cards.push({
      id: "voters",
      title: t("dashboard.cards.registeredVoters", "الناخبون المسجلون"),
      value: numberFormatter.format(votersStat.value),
      change: votersStat.change,
      icon: Users,
      gradient: "from-cyan-400/80 to-indigo-400/70",
    });

    const volunteersStat = getStatDetails("active_volunteers", "volunteers");
    cards.push({
      id: "volunteers",
      title: t("dashboard.cards.activeVolunteers", "المتطوعون النشطون"),
      value: numberFormatter.format(volunteersStat.value),
      change: volunteersStat.change,
      icon: UserCheck,
      gradient: "from-purple-400/80 to-pink-400/70",
    });

    const eventsStat = getStatDetails("events", "events");
    cards.push({
      id: "events",
      title: t("dashboard.cards.events", "الفعاليات"),
      value: numberFormatter.format(eventsStat.value),
      change: eventsStat.change,
      icon: CalendarDays,
      gradient: "from-amber-400/80 to-rose-400/70",
    });

    return cards;
  }, [
    averageTurnout,
    dashboardPayload,
    numberFormatter,
    statsRecord,
    t,
    turnoutChange,
  ]);

  const turnoutData: TurnoutPoint[] = useMemo(
    () =>
      turnoutSeries.map((entry, index) => ({
        label:
          entry.label ??
          t("dashboard.turnoutPoint", {
            index: index + 1,
            defaultValue: language === "ar" ? `المرحلة ${index + 1}` : `Period ${index + 1}`,
          }),
        turnout: safeNumber(entry.value),
        momentum: safeNumber(entry.momentum),
      })),
    [language, t, turnoutSeries],
  );

  const progressData = useMemo<DistributionSlice[]>(() => {
    const progress = dashboardPayload?.progress ?? {};
    const entries: Array<{ key: keyof DashboardProgress; fallback: string }> = [
      { key: "registration", fallback: "registration" },
      { key: "verification", fallback: "verification" },
      { key: "campaign", fallback: "campaign" },
      { key: "voting", fallback: "voting" },
    ];

    return entries.map(({ key, fallback }) => ({
      label: t(`dashboard.progress.${fallback}`, fallback),
      value: safeNumber((progress as Record<string, unknown>)[key]),
    }));
  }, [dashboardPayload?.progress, t]);

  const overallProgress = safeNumber(dashboardPayload?.progress?.overall);
  const remainingProgress = safeNumber(dashboardPayload?.progress?.remaining);

  const registrationTrend: TrendPoint[] = useMemo(() => {
    const registrations = safeArray(dashboardPayload?.registrations as DashboardRegistration[]);
    const counts = registrations.map((entry) => safeNumber(entry?.count));

    return registrations.map((entry, index) => {
      const rawMonth = typeof entry?.month === "string" ? entry.month : "";
      let label = rawMonth;
      if (rawMonth) {
        const date = new Date(`${rawMonth}-01T00:00:00`);
        if (!Number.isNaN(date.getTime())) {
          label = monthFormatter.format(date);
        }
      }

      const current = counts[index] ?? 0;
      const previous = index > 0 ? counts[index - 1] ?? 0 : current;

      return {
        label: label || t("dashboard.registrationFallback", { index: index + 1, defaultValue: `شهر ${index + 1}` }),
        primary: current,
        secondary: current - previous,
      };
    });
  }, [dashboardPayload?.registrations, monthFormatter, t]);

  const activitySummary: BarSegment[] = useMemo(() => {
    const activities = safeArray(dashboardPayload?.activities as DashboardActivity[]);
    const counters = new Map<string, number>();

    activities.forEach((activity) => {
      const type = typeof activity?.type === "string" && activity.type ? (activity.type as string) : "other";
      counters.set(type, (counters.get(type) ?? 0) + 1);
    });

    return Array.from(counters.entries()).map(([type, value]) => ({
      label: t(`dashboard.activity.${type}`, type.replace(/_/g, " ")),
      value,
    }));
  }, [dashboardPayload?.activities, t]);

  const mapPoints: MapPoint[] = useMemo(() => {
    const raw = heatmapRaw && typeof heatmapRaw === "object" && "data" in heatmapRaw ? heatmapRaw.data : heatmapRaw;
    return safeArray(raw as Array<{ lat?: unknown; lng?: unknown }>)
      .map((point) => ({
        lat: safeNumber(point?.lat),
        lng: safeNumber(point?.lng),
      }))
      .filter(
        (point) =>
          Number.isFinite(point.lat) &&
          Number.isFinite(point.lng) &&
          !(point.lat === 0 && point.lng === 0),
      );
  }, [heatmapRaw]);

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([fetchDashboard(), fetchHeatmap()]);
      toast({ description: t("dashboard.loadSuccess", "تم تحديث بيانات لوحة التحكم") });
    } catch (error) {
      toast({ variant: "destructive", description: t("dashboard.loadError", "تعذر تحديث بيانات لوحة التحكم") });
    }
  }, [fetchDashboard, fetchHeatmap, t]);

  const dashboardErrorMessage = dashboardError?.message ?? undefined;
  const mapErrorMessage = heatmapError ? t("dashboard.heatmapError", "تعذر تحميل بيانات الخريطة") : undefined;

  return (
    <AuroraBackground>
      <div className="relative flex min-h-screen flex-col gap-8 pb-24">
        <Header />
        <motion.div
          layout
          className={`relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-0 lg:flex-row ${language === "ar" ? "lg:flex-row-reverse" : ""}`}
        >
          <Sidebar />
          <DashboardContent
            overviewCards={overviewCards}
            turnoutData={turnoutData}
            progressDistribution={progressData}
            registrationTrend={registrationTrend}
            activitySummary={activitySummary}
            overallProgress={overallProgress}
            remainingProgress={remainingProgress}
            loading={dashboardLoading}
            error={dashboardErrorMessage}
            onRetry={handleRefresh}
            mapPoints={mapPoints}
            mapLoading={heatmapLoading}
            mapError={mapErrorMessage}
            onMapRetry={handleRefresh}
          />
        </motion.div>
        <FloatingActions onRefresh={handleRefresh} isRefreshing={dashboardLoading || heatmapLoading} />
      </div>
    </AuroraBackground>
  );
};

export default FloatingDashboard;
