import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Vote,
  UserCheck,
  Users,
  Activity,
  CheckCircle,
  Shield,
  RefreshCcw,
  CalendarCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ActivityPanel,
  LiveOperationsPanel,
  ProgressOverview,
  StatsOverview,
  SummaryPanel,
  type StatMetric,
} from './DashboardWidgets';

interface StatResponseItem {
  value: number;
  change?: string;
  trend?: 'up' | 'down';
}

interface DashboardResponse {
  stats: Record<string, StatResponseItem>;
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

const activityIconMap: Record<string, typeof CheckCircle> = {
  election_created: Vote,
  voters_imported: UserCheck,
  candidate_registered: Users,
  committee_assigned: Activity,
  agent_onboarded: Shield,
};

const defaultDashboard: DashboardResponse = {
  stats: {},
  activities: [],
  progress: {
    registration: 0,
    verification: 0,
    campaign: 0,
    voting: 0,
    overall: 0,
    remaining: 0,
  },
  turnout: [],
};

export const EnhancedDashboard = () => {
  const { t, i18n } = useTranslation();
  const { direction, language } = useLanguage();
  const {
    data,
    loading,
    error,
    execute: refetchDashboard,
  } = useApi<DashboardResponse>({ url: '/dashboard', method: 'GET' });

  useEffect(() => {
    refetchDashboard()
      .then(() => toast({ description: t('dashboard.load_success') }))
      .catch(() => toast({ variant: 'destructive', description: t('dashboard.load_error') }));
  }, [refetchDashboard, t]);

  const dashboardData = data ?? defaultDashboard;

  const statsMetrics: StatMetric[] = useMemo(() => {
    const config = [
      { key: 'total_elections', icon: Vote, color: 'primary' as const },
      { key: 'active_voters', icon: UserCheck, color: 'secondary' as const },
      { key: 'total_candidates', icon: Users, color: 'accent' as const },
      { key: 'committees_count', icon: Activity, color: 'success' as const },
    ];

    return config.map((stat) => {
      const statPayload = dashboardData.stats[stat.key] ?? { value: 0, change: '0%', trend: 'up' };
      return {
        key: stat.key,
        label: `dashboard.${stat.key}`,
        value: statPayload.value ?? 0,
        change: statPayload.change ?? '0%',
        trend: (statPayload.trend ?? 'up') as 'up' | 'down',
        icon: stat.icon,
        color: stat.color,
      } satisfies StatMetric;
    });
  }, [dashboardData.stats]);

  const progressData = useMemo(
    () => [
      { label: t('dashboard.registration'), value: dashboardData.progress.registration ?? 0, color: 'primary' as const },
      { label: t('dashboard.verification'), value: dashboardData.progress.verification ?? 0, color: 'secondary' as const },
      { label: t('dashboard.campaign'), value: dashboardData.progress.campaign ?? 0, color: 'accent' as const },
      { label: t('dashboard.voting'), value: dashboardData.progress.voting ?? 0, color: 'success' as const },
    ],
    [dashboardData.progress.campaign, dashboardData.progress.registration, dashboardData.progress.verification, dashboardData.progress.voting, t]
  );

  const activities = useMemo(
    () =>
      dashboardData.activities.map((activity) => ({
        ...activity,
        icon: activityIconMap[activity.type] ?? CheckCircle,
      })),
    [dashboardData.activities]
  );

  const averageTurnout = useMemo(() => {
    if (!dashboardData.turnout.length) {
      return 0;
    }
    const sum = dashboardData.turnout.reduce((total, value) => total + value, 0);
    return sum / dashboardData.turnout.length;
  }, [dashboardData.turnout]);

  const refreshLabel = language === 'ar' ? 'تحديث الآن' : 'Refresh insights';

  return (
    <section dir={direction} className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-[32px] bg-gradient-to-r from-[#1C3F60] via-[#1C3F60]/95 to-[#0f2740] p-8 text-white shadow-xl"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge className="w-fit bg-[#E7B10A] text-[#1C3F60] shadow-sm">
              {language === 'ar' ? 'لوحة التحكم المتقدمة' : 'Advanced electoral operations'}
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {t('dashboard.welcome')}
            </h1>
            <p className="max-w-2xl text-sm text-white/80 sm:text-base">
              {t('dashboard.subtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/75">
              <span className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'full' }).format(new Date())}
              </span>
              <span className="rounded-full border border-white/20 px-3 py-1">
                {language === 'ar' ? 'جاهز للعرض التجريبي v1.0.0' : 'Demo-ready release v1.0.0'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="rounded-2xl border border-white/20 bg-white/15 text-white hover:bg-white/25"
              onClick={() =>
                refetchDashboard()
                  .then(() => toast({ description: t('dashboard.load_success') }))
                  .catch(() => toast({ variant: 'destructive', description: t('dashboard.load_error') }))
              }
              disabled={loading}
            >
              <RefreshCcw className="me-2 h-4 w-4" />
              {refreshLabel}
            </Button>
          </div>
        </div>
      </motion.div>

      <StatsOverview metrics={statsMetrics} loading={loading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProgressOverview
            data={progressData}
            loading={loading}
            error={error}
            onRetry={() =>
              refetchDashboard()
                .then(() => toast({ description: t('dashboard.load_success') }))
                .catch(() => toast({ variant: 'destructive', description: t('dashboard.load_error') }))
            }
            overall={dashboardData.progress.overall ?? 0}
            remaining={dashboardData.progress.remaining ?? 0}
            heading={t('dashboard.election_progress')}
            description={t('dashboard.overall_progress')}
            overallLabel={t('dashboard.overall_progress')}
            remainingLabel={t('dashboard.days_remaining')}
          />
        </div>
        <ActivityPanel
          activities={activities}
          loading={loading}
          heading={t('dashboard.recent_activity')}
          description={t('dashboard.view_all_activities')}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <LiveOperationsPanel
          loading={loading}
          heading={t('dashboard.voter_turnout')}
          description={language === 'ar' ? 'راقب التغطية الميدانية لحظياً' : 'Monitor field coverage in real time'}
        />
        <SummaryPanel
          headline={language === 'ar' ? 'مؤشرات التقدم العامة' : 'Overall progress insights'}
          description={language === 'ar' ? 'تحليلات مجمعة لأداء الفريق الميداني' : 'Aggregated insights for field execution'}
          overallLabel={t('dashboard.overall_progress')}
          overallValue={dashboardData.progress.overall ?? 0}
          turnoutLabel={t('dashboard.voter_turnout')}
          turnoutValue={averageTurnout}
          remainingLabel={t('dashboard.days_remaining')}
          remainingValue={dashboardData.progress.remaining ?? 0}
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive">
          {t('dashboard.load_error')}
        </p>
      )}
    </section>
  );
};
