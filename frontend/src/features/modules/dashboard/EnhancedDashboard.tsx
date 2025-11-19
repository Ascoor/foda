import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Vote, UserCheck, Users, Activity, TrendingUp } from "lucide-react";
import { SafeDataRenderer } from "@/infrastructure/shared/ui/safe-data-renderer";
import { ProgressChart } from "@/features/modules/dashboard/components/ProgressChart";
import { ActivityFeed } from "@/features/modules/dashboard/components/ActivityFeed";
import { LiveOperationsMap } from "@/features/modules/dashboard/components/LiveOperationsMap";
import { ActivitiesTimeline } from "@/features/modules/activities/ActivitiesTimeline";
import { useApi } from "@/infrastructure/shared/lib/api";
import { safeArray, safeNumber } from "@/infrastructure/shared/lib/safeData";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import { useCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";
import { toast } from "@/infrastructure/shared/hooks/use-toast";
import {
  dataStateVariants,
  type DataState,
} from "@/infrastructure/config/motion.config";
import { useMotionPreset } from "@/infrastructure/hooks/useMotionPreset";
import { MotionCard } from "@/ui/components/motion/MotionCard";

interface DashboardData {
  stats: Record<
    string,
    { value: number; change?: string; trend?: "up" | "down" }
  >;
  activities: Array<{ id: number; type: string; title: string; time: string }>;
  progress: {
    registration: number;
    verification: number;
    campaign: number;
    voting: number;
    overall: number;
    remaining: number;
  };
  turnout: number[];
}

const AnimatedCounter = ({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const kpiContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const kpiItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const KPICard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = "primary",
}: {
  title: string;
  value: number;
  change?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
  color?: "primary" | "secondary" | "accent" | "success";
}) => {
  const colorClasses = {
    primary: "from-primary to-primary-glow text-primary-foreground",
    secondary: "from-secondary to-secondary-glow text-secondary-foreground",
    accent: "from-accent to-accent-glow text-accent-foreground",
    success: "from-success to-green-400 text-white",
  };

  return (
    <MotionCard className="glass-card group cursor-pointer relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`
          p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}
          shadow-lg group-hover:shadow-xl transition-all duration-300
        `}
        >
          <Icon className="h-6 w-6" />
        </div>

        {change && (
          <div
            className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${trend === "up" ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}
          `}
          >
            <TrendingUp
              className={`h-3 w-3 ${trend === "down" ? "rotate-180" : ""}`}
            />
            {change}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
          <AnimatedCounter value={value} />
        </h3>
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
    </MotionCard>
  );
};

export const EnhancedDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { campaignId } = useCampaignContext();
  const dashboardEndpoint = useMemo(() => {
    if (!campaignId) {
      return null;
    }
    try {
      return API_ENDPOINTS.dashboard.overview(campaignId);
    } catch (error) {
      console.warn("Dashboard endpoint unavailable without campaign", error);
      return null;
    }
  }, [campaignId]);

  // Dashboard data query
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    execute: refetchDashboard,
  } = useApi<DashboardData>({
    url: dashboardEndpoint ?? undefined,
    method: "GET",
  });

  useEffect(() => {
    if (!dashboardEndpoint) {
      return;
    }

    refetchDashboard({ url: dashboardEndpoint })
      .then(() => toast({ description: t("dashboard.load_success") }))
      .catch(() =>
        toast({
          variant: "destructive",
          description: t("dashboard.load_error"),
        }),
      );
  }, [dashboardEndpoint, refetchDashboard, t]);

  const safeStats = useMemo(() => {
    const stats = dashboardData?.stats;
    if (!stats || typeof stats !== "object") {
      return {} as Record<string, Partial<DashboardData["stats"][string]>>;
    }

    return stats;
  }, [dashboardData?.stats]);

  const safeProgress = useMemo(
    () => ({
      registration: safeNumber(dashboardData?.progress?.registration),
      verification: safeNumber(dashboardData?.progress?.verification),
      campaign: safeNumber(dashboardData?.progress?.campaign),
      voting: safeNumber(dashboardData?.progress?.voting),
      overall: safeNumber(dashboardData?.progress?.overall),
      remaining: safeNumber(dashboardData?.progress?.remaining),
    }),
    [dashboardData?.progress],
  );

  const safeActivities = useMemo(() => {
    return safeArray(dashboardData?.activities).map((activity, index) => {
      const normalized = activity as
        | Partial<DashboardData["activities"][number]>
        | undefined;

      return {
        id: typeof normalized?.id === "number" ? normalized.id : index,
        type:
          typeof normalized?.type === "string" ? normalized.type : "activity",
        title:
          typeof normalized?.title === "string"
            ? normalized.title
            : t("dashboard.activity_placeholder", {
                defaultValue: "Activity update",
              }),
        time: typeof normalized?.time === "string" ? normalized.time : "",
        icon: Vote,
      };
    });
  }, [dashboardData?.activities, t]);

  const statsConfig = [
    {
      key: "total_elections",
      icon: Vote,
      color: "primary" as const,
      title: t("dashboard.total_elections"),
    },
    {
      key: "active_voters",
      icon: UserCheck,
      color: "secondary" as const,
      title: t("dashboard.active_voters"),
    },
    {
      key: "total_candidates",
      icon: Users,
      color: "accent" as const,
      title: t("dashboard.total_candidates"),
    },
    {
      key: "committees_count",
      icon: Activity,
      color: "success" as const,
      title: t("dashboard.committees_count"),
    },
  ];

  const progressData = [
    {
      label: t("dashboard.registration"),
      value: safeProgress.registration,
      color: "primary" as const,
    },
    {
      label: t("dashboard.verification"),
      value: safeProgress.verification,
      color: "secondary" as const,
    },
    {
      label: t("dashboard.campaign"),
      value: safeProgress.campaign,
      color: "accent" as const,
    },
    {
      label: t("dashboard.voting"),
      value: safeProgress.voting,
      color: "success" as const,
    },
  ];

  const getStatDetails = (key: string) => {
    const stat = safeStats[key];

    if (!stat || typeof stat !== "object") {
      return {
        value: 0,
        change: undefined,
        trend: undefined as "up" | "down" | undefined,
      };
    }

    const candidateTrend = (stat as { trend?: unknown }).trend;
    const normalizedTrend =
      candidateTrend === "up" || candidateTrend === "down"
        ? candidateTrend
        : undefined;

    return {
      value: safeNumber((stat as { value?: unknown }).value),
      change:
        typeof (stat as { change?: unknown }).change === "string"
          ? (stat as { change?: string }).change
          : undefined,
      trend: normalizedTrend,
    };
  };

  const resolveDataState = (hasContent: boolean): DataState => {
    if (dashboardLoading) return "loading";
    if (dashboardError) return "error";
    if (!hasContent) return "empty";
    return "success";
  };

  const progressState = resolveDataState(progressData.some((item) => item.value > 0));
  const activitiesState = resolveDataState(safeActivities.length > 0);

  const heroTitlePreset = useMotionPreset("fadeDown");
  const heroSubtitlePreset = useMotionPreset("fadeUp");
  const sectionRevealPreset = useMotionPreset("fadeUp", {
    directional: true,
    directionalAxis: "y",
    distance: 32,
  });

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <MotionCard className="glass-card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="py-8 text-center">
          <motion.h1
            className="text-4xl font-bold mb-2 neon-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={heroTitlePreset?.initial}
            animate={heroTitlePreset?.animate}
            variants={heroTitlePreset?.variants}
            transition={{ type: "spring", stiffness: 200, ...(heroTitlePreset?.transition ?? {}) }}
          >
            {t("dashboard.welcome")}
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={heroSubtitlePreset?.initial}
            animate={heroSubtitlePreset?.animate}
            variants={heroSubtitlePreset?.variants}
            transition={heroSubtitlePreset?.transition}
          >
            {t("dashboard.subtitle")}
          </motion.p>
        </div>
      </MotionCard>

      {/* KPI Stats Grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={kpiContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsConfig.map((stat) => {
          const details = getStatDetails(stat.key);

          return (
            <motion.div key={stat.key} variants={kpiItemVariants}>
              <KPICard
                title={stat.title}
                value={details.value}
                change={details.change}
                trend={details.trend}
                icon={stat.icon}
                color={stat.color}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MotionCard className="lg:col-span-2 p-0">
          <motion.section
            className="p-4"
            animate={progressState}
            variants={dataStateVariants}
            transition={{ duration: 0.25 }}
          >
            <SafeDataRenderer
              data={progressData}
              loading={dashboardLoading}
              error={dashboardError}
              onRetry={refetchDashboard}
              loadingMessage={t("dashboard.loading_progress")}
            >
              {(data) => (
                <ProgressChart
                  data={data}
                  overall={safeProgress.overall}
                  remaining={safeProgress.remaining}
                />
              )}
            </SafeDataRenderer>
          </motion.section>
        </MotionCard>

        <MotionCard className="p-0">
          <motion.section
            className="p-4"
            animate={activitiesState}
            variants={dataStateVariants}
            transition={{ duration: 0.25 }}
          >
            <SafeDataRenderer
              data={safeActivities}
              loading={dashboardLoading}
              error={dashboardError}
              onRetry={refetchDashboard}
              loadingMessage={t("dashboard.loading_activities")}
            >
              {(data) => <ActivityFeed activities={data} />}
            </SafeDataRenderer>
          </motion.section>
        </MotionCard>
      </div>

      {/* Live Map */}
      <MotionCard className="p-0">
        <motion.section
          className="p-4"
          initial={sectionRevealPreset?.initial}
          animate={sectionRevealPreset?.animate}
          variants={sectionRevealPreset?.variants}
          transition={sectionRevealPreset?.transition}
        >
          <LiveOperationsMap />
        </motion.section>
      </MotionCard>

      {/* Activity Timeline */}
      <MotionCard className="p-0">
        <motion.section
          className="p-4"
          initial={sectionRevealPreset?.initial}
          animate={sectionRevealPreset?.animate}
          variants={sectionRevealPreset?.variants}
          transition={sectionRevealPreset?.transition}
        >
          <ActivitiesTimeline />
        </motion.section>
      </MotionCard>
    </div>
  );
};
