import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Vote, UserCheck, Users, Activity, TrendingUp } from "lucide-react";
import { SafeDataRenderer } from "@shared/ui/safe-data-renderer";
import { ProgressChart } from "@features/dashboard/components/ProgressChart";
import { ActivityFeed } from "@features/dashboard/components/ActivityFeed";
import { LiveOperationsMap } from "@features/dashboard/components/LiveOperationsMap";
import { ActivitiesTimeline } from "@features/activities/ActivitiesTimeline";
import { safeArray, safeNumber } from "@shared/lib/safeData";
import {
  useDashboardStats,
  useLiveMapData,
  useRecentActivities,
} from "./api/dashboard.service";

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
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card group cursor-pointer relative overflow-hidden"
    >
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
    </motion.div>
  );
};

interface EnhancedDashboardProps {
  campaignId: string | null | undefined;
  electionId: string | null | undefined;
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  campaignId,
  electionId,
}) => {
  const { t } = useTranslation();

  const {
    data: statsData,
    isPending: statsPending,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats(campaignId, electionId);

  const {
    data: activitiesData,
    isPending: activitiesPending,
    error: activitiesError,
    refetch: refetchActivities,
  } = useRecentActivities(campaignId, electionId);

  const {
    data: liveMapData,
    isPending: liveMapPending,
    isFetching: liveMapFetching,
    error: liveMapError,
    refetch: refetchLiveMap,
  } = useLiveMapData(campaignId, electionId);

  const statsErrorValue = useMemo(() => {
    if (!statsError) return null;
    if (statsError instanceof Error) return statsError;
    return new Error(
      t("dashboard.load_error", {
        defaultValue: "Unable to load dashboard data.",
      }),
    );
  }, [statsError, t]);

  const activitiesErrorValue = useMemo(() => {
    if (!activitiesError) return null;
    if (activitiesError instanceof Error) return activitiesError;
    return new Error(
      t("dashboard.load_error", {
        defaultValue: "Unable to load dashboard data.",
      }),
    );
  }, [activitiesError, t]);

  const liveMapErrorValue = useMemo(() => {
    if (!liveMapError) return null;
    if (liveMapError instanceof Error) return liveMapError;
    return new Error(
      t("dashboard.map_load_error", {
        defaultValue: "Unable to load live operations map.",
      }),
    );
  }, [liveMapError, t]);

  const statsLoading = statsPending && !statsData;
  const activitiesLoading = activitiesPending && !activitiesData?.length;
  const liveMapLoading = (liveMapPending || liveMapFetching) && !liveMapData;
  const hasContext = Boolean(campaignId && electionId);
  const contextPlaceholder = (
    <div className="glass-card p-10 text-center space-y-4">
      <h2 className="text-2xl font-semibold">
        {t("dashboard.select_election_title", {
          defaultValue: "Select an election to view the dashboard",
        })}
      </h2>
      <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
        {t("dashboard.select_election_description", {
          defaultValue:
            "Choose a campaign and election from the ribbon to explore real-time insights.",
        })}
      </p>
    </div>
  );

  const safeStats = useMemo(() => {
    const stats = statsData?.stats;
    if (!stats || typeof stats !== "object") {
      return {} as Record<string, Partial<DashboardData["stats"][string]>>;
    }

    return stats;
  }, [statsData?.stats]);

  const safeProgress = useMemo(
    () => ({
      registration: safeNumber(statsData?.progress?.registration),
      verification: safeNumber(statsData?.progress?.verification),
      campaign: safeNumber(statsData?.progress?.campaign),
      voting: safeNumber(statsData?.progress?.voting),
      overall: safeNumber(statsData?.progress?.overall),
      remaining: safeNumber(statsData?.progress?.remaining),
    }),
    [statsData?.progress],
  );

  const safeActivities = useMemo(() => {
    return safeArray(activitiesData).map((activity, index) => {
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
  }, [activitiesData, t]);

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

  const progressData = useMemo(() => {
    if (!statsData) return [] as Array<{ label: string; value: number; color: "primary" | "secondary" | "accent" | "success" }>;

    return [
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
  }, [safeProgress, statsData, t]);

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

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"
      >
        <div className="text-center py-8">
          <motion.h1
            className="text-4xl font-bold mb-2 neon-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {t("dashboard.welcome")}
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            {t("dashboard.subtitle")}
          </p>
        </div>
      </motion.div>

      {!hasContext ? (
        contextPlaceholder
      ) : (
        <>
          {/* KPI Stats Grid */}
          <SafeDataRenderer
            data={statsData ? [statsData] : []}
            loading={statsLoading}
            error={statsErrorValue}
            onRetry={() => refetchStats()}
            loadingMessage={t("dashboard.loading_overview", {
              defaultValue: "Loading key metrics…",
            })}
            emptyTitle={t("dashboard.no_stats_title", {
              defaultValue: "No metrics available",
            })}
            emptyDescription={t("dashboard.no_stats_description", {
              defaultValue: "Once data starts flowing for this election, insights will appear here.",
            })}
          >
            {() => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat, index) => {
                  const details = getStatDetails(stat.key);

                  return (
                    <motion.div
                      key={stat.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
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
              </div>
            )}
          </SafeDataRenderer>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <SafeDataRenderer
                data={progressData}
                loading={statsLoading}
                error={statsErrorValue}
                onRetry={() => refetchStats()}
                loadingMessage={t("dashboard.loading_progress", {
                  defaultValue: "Loading campaign progress…",
                })}
                emptyTitle={t("dashboard.no_progress_title", {
                  defaultValue: "No progress data yet",
                })}
                emptyDescription={t("dashboard.no_progress_description", {
                  defaultValue: "Trackers will appear once activities report measurable progress.",
                })}
              >
                {(data) => (
                  <ProgressChart
                    data={data}
                    overall={safeProgress.overall}
                    remaining={safeProgress.remaining}
                  />
                )}
              </SafeDataRenderer>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SafeDataRenderer
                data={safeActivities}
                loading={activitiesLoading}
                error={activitiesErrorValue}
                onRetry={() => refetchActivities()}
                loadingMessage={t("dashboard.loading_activities", {
                  defaultValue: "Loading recent activities…",
                })}
                emptyTitle={t("dashboard.no_activity_title", {
                  defaultValue: "No activity yet",
                })}
                emptyDescription={t("dashboard.no_activity_description", {
                  defaultValue: "Recent field updates will appear here as soon as teams report them.",
                })}
              >
                {(data) => <ActivityFeed activities={data} />}
              </SafeDataRenderer>
            </motion.div>
          </div>

          {/* Live Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SafeDataRenderer
              data={liveMapData ? [liveMapData] : []}
              loading={liveMapLoading}
              error={liveMapErrorValue}
              onRetry={() => refetchLiveMap()}
              loadingMessage={t("dashboard.loading_map", {
                defaultValue: "Loading live operations map…",
              })}
              emptyTitle={t("dashboard.no_map_data_title", {
                defaultValue: "No map data yet",
              })}
              emptyDescription={t("dashboard.no_map_data_description", {
                defaultValue: "Geospatial activity data will appear once field reports include locations.",
              })}
            >
              {(data) => (
                <LiveOperationsMap
                  committees={data[0]?.committees}
                  activities={data[0]?.activities}
                  loading={liveMapLoading}
                />
              )}
            </SafeDataRenderer>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ActivitiesTimeline
              campaignId={campaignId ?? null}
              electionId={electionId ?? null}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};
