import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Vote, UserCheck, Users, Activity, TrendingUp } from 'lucide-react';
import { SafeDataRenderer } from '@/components/ui/SafeDataRenderer';
import { ProgressChart } from '@/modules/dashboard/components/ProgressChart';
import { ActivityFeed } from '@/modules/dashboard/components/ActivityFeed';
import { LiveOperationsMap } from '@/modules/dashboard/components/LiveOperationsMap';
import { ActivitiesTimeline } from '@/modules/activities/ActivitiesTimeline';
import { useApi } from '@/lib/api';   
import { safeArray, safeNumber } from '@/lib/safeData';
import { API_ENDPOINTS } from '@/lib/endpoints';
import { toast } from '@/hooks/use-toast';

interface DashboardData {
  stats: Record<string, { value: number; change?: string; trend?: 'up' | 'down' }>;
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
  duration = 2000 
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
  color = 'primary' 
}: {
  title: string;
  value: number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}) => {
  const colorClasses = {
    primary: 'from-primary to-primary-glow text-primary-foreground',
    secondary: 'from-secondary to-secondary-glow text-secondary-foreground',
    accent: 'from-accent to-accent-glow text-accent-foreground',
    success: 'from-success to-green-400 text-white'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card group relative cursor-pointer overflow-hidden"
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`
          p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}
          shadow-lg group-hover:shadow-xl transition-all duration-300
        `}>
          <Icon className="h-6 w-6" />
        </div>
        
        {change && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${trend === 'up' ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'}
          `}>
            <TrendingUp className={`h-3 w-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
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
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
};

export const EnhancedDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  // Dashboard data query
  const { 
    data: dashboardData, 
    loading: dashboardLoading, 
    error: dashboardError,
    execute: refetchDashboard 
  } = useApi<DashboardData>({
    url: API_ENDPOINTS.dashboard.overview,
    method: 'GET'
  });
  
  useEffect(() => {
    refetchDashboard()
      .then(() => toast({ description: t('dashboard.load_success') }))
      .catch(() => toast({ variant: 'destructive', description: t('dashboard.load_error') }));
  }, [refetchDashboard, t]);
  
  const safeStats = useMemo(() => {
    const stats = dashboardData?.stats;
    if (!stats || typeof stats !== 'object') {
      return {} as Record<string, Partial<DashboardData['stats'][string]>>;
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
      remaining: safeNumber(dashboardData?.progress?.remaining)
    }),
    [dashboardData?.progress]
  );

  const safeActivities = useMemo(() => {
    return safeArray(dashboardData?.activities).map((activity, index) => {
      const normalized = activity as Partial<DashboardData['activities'][number]> | undefined;

      return {
        id: typeof normalized?.id === 'number' ? normalized.id : index,
        type: typeof normalized?.type === 'string' ? normalized.type : 'activity',
        title: typeof normalized?.title === 'string' ? normalized.title : t('dashboard.activity_placeholder', { defaultValue: 'Activity update' }),
        time: typeof normalized?.time === 'string' ? normalized.time : '',
        icon: Vote
      };
    });
  }, [dashboardData?.activities, t]);
  
  const statsConfig = [
    { key: 'total_elections', icon: Vote, color: 'primary' as const, title: t('dashboard.total_elections') },
    { key: 'active_voters', icon: UserCheck, color: 'secondary' as const, title: t('dashboard.active_voters') },
    { key: 'total_candidates', icon: Users, color: 'accent' as const, title: t('dashboard.total_candidates') },
    { key: 'committees_count', icon: Activity, color: 'success' as const, title: t('dashboard.committees_count') },
  ];
  
  const progressData = [
    { label: t('dashboard.registration'), value: safeProgress.registration, color: 'primary' as const },
    { label: t('dashboard.verification'), value: safeProgress.verification, color: 'secondary' as const },
    { label: t('dashboard.campaign'), value: safeProgress.campaign, color: 'accent' as const },
    { label: t('dashboard.voting'), value: safeProgress.voting, color: 'success' as const },
  ];

  const getStatDetails = (key: string) => {
    const stat = safeStats[key];

    if (!stat || typeof stat !== 'object') {
      return {
        value: 0,
        change: undefined,
        trend: undefined as 'up' | 'down' | undefined
      };
    }

    const candidateTrend = (stat as { trend?: unknown }).trend;
    const normalizedTrend = candidateTrend === 'up' || candidateTrend === 'down' ? candidateTrend : undefined;

    return {
      value: safeNumber((stat as { value?: unknown }).value),
      change: typeof (stat as { change?: unknown }).change === 'string' ? (stat as { change?: string }).change : undefined,
      trend: normalizedTrend
    };
  };
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-20 mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 pb-24 md:p-10"
    >
      {/* Hero Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 text-center"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <div className="py-8">
          <motion.h1
            className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {t('dashboard.welcome')}
          </motion.h1>
          <p className="mt-3 text-lg text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsConfig.map((stat, index) => {
          const details = getStatDetails(stat.key);

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
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
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <motion.div
            layout
            className="glass-card h-full"
            style={{ boxShadow: "var(--shadow-glass)" }}
          >
            <SafeDataRenderer
              data={progressData}
              loading={dashboardLoading}
              error={dashboardError}
              onRetry={refetchDashboard}
              loadingMessage={t('dashboard.loading_progress')}
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
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <motion.div
            layout
            className="glass-card h-full"
            style={{ boxShadow: "var(--shadow-glass)" }}
          >
            <SafeDataRenderer
              data={safeActivities}
              loading={dashboardLoading}
              error={dashboardError}
              onRetry={refetchDashboard}
              loadingMessage={t('dashboard.loading_activities')}
            >
              {(data) => <ActivityFeed activities={data} />}
            </SafeDataRenderer>
          </motion.div>
        </motion.div>
      </div>

      {/* Live Map */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <LiveOperationsMap />
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass-card"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <ActivitiesTimeline />
      </motion.div>
    </motion.section>
  );
};