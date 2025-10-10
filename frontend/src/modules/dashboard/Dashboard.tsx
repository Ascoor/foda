import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Vote, UserCheck, Users, Activity, CheckCircle } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { ActivityFeed } from './components/ActivityFeed';
import { ProgressChart } from './components/ProgressChart';
import { LiveOperationsMap } from './components/LiveOperationsMap';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatItem {
  value: number;
  change?: string;
  trend?: 'up' | 'down';
}

interface DashboardResponse {
  stats: Record<string, StatItem>;
  activities: { id: number; type: string; title: string; time: string }[];
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

const statConfig = [
  { key: 'total_elections', icon: Vote, color: 'primary' as const },
  { key: 'active_voters', icon: UserCheck, color: 'secondary' as const },
  { key: 'total_candidates', icon: Users, color: 'accent' as const },
  { key: 'committees_count', icon: Activity, color: 'success' as const },
];

const activityIcons: Record<string, any> = {
  election_created: Vote,
  voters_imported: UserCheck,
  candidate_registered: Users,
  committee_assigned: CheckCircle,
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';
  const { data, loading, error, execute } = useApi<DashboardResponse>({ url: '/dashboard', method: 'GET' });
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    execute()
      .then(() => toast({ description: t('dashboard.load_success') }))
      .catch(() => toast({ variant: 'destructive', description: t('dashboard.load_error') }));
  }, [execute, t]);

  const statsData = statConfig.map((s) => ({
    title: `dashboard.${s.key}`,
    value: data?.stats?.[s.key]?.value?.toString() ?? '0',
    change: data?.stats?.[s.key]?.change ?? '0%',
    trend: (data?.stats?.[s.key]?.trend ?? 'up') as 'up' | 'down',
    icon: s.icon,
    color: s.color,
  }));

  const activities =
    data?.activities?.map((a) => ({
      ...a,
      icon: activityIcons[a.type] || Activity,
    })) ?? [];

  const progressData = [
    { label: 'dashboard.registration', value: data?.progress?.registration ?? 0, color: 'primary' as const },
    { label: 'dashboard.verification', value: data?.progress?.verification ?? 0, color: 'secondary' as const },
    { label: 'dashboard.campaign', value: data?.progress?.campaign ?? 0, color: 'accent' as const },
    { label: 'dashboard.voting', value: data?.progress?.voting ?? 0, color: 'success' as const },
  ];

  const overall = data?.progress?.overall ?? 0;
  const remaining = data?.progress?.remaining ?? 0;

  return (
    <div dir={direction} className="min-h-screen flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* ====== Header / Welcome Section ====== */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card text-center py-10 shadow-xl rounded-2xl"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient-primary mb-2">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          {t('dashboard.subtitle')}
        </p>
      </motion.div>

      {/* ====== Stats Grid ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 glass-card animate-pulse rounded-2xl" />
            ))
          : statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
      </div>

      {/* ====== Charts + Activity ====== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2"
        >
          {loading ? (
            <div className="h-72 glass-card animate-pulse rounded-2xl" />
          ) : (
            <ProgressChart data={progressData} overall={overall} remaining={remaining} />
          )}
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="h-72 glass-card animate-pulse rounded-2xl" />
          ) : (
            <ActivityFeed activities={activities} />
          )}
        </motion.div>
      </div>

      {/* ====== Live Map ====== */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        {loading ? (
          <div className="h-96 glass-card animate-pulse" />
        ) : (
          <LiveOperationsMap />
        )}
      </motion.div>

      {/* ====== Error ====== */}
      {error && (
        <p className="text-destructive text-sm text-center mt-4">
          {t('dashboard.load_error')}
        </p>
      )}
    </div>
  );
};
