import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Vote, UserCheck, Users, Activity, CheckCircle, Shield, RefreshCcw, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActivityPanel, LiveOperationsPanel, ProgressOverview, StatsOverview, SummaryPanel, type StatMetric } from './DashboardWidgets';

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
  const { data, loading, error, execute: refetchDashboard } = useApi<DashboardResponse>({ url: '/dashboard', method: 'GET' });

  // 🕒 تحديث الوقت
  const [dateTime, setDateTime] = useState(new Date());
  const dashboardData: DashboardResponse = data ?? defaultDashboard;

  useEffect(() => {
    refetchDashboard().catch(() => {
      /* Initial fetch errors are handled by the component UI */
    });
  }, [refetchDashboard]); 

  const formattedTime = dateTime.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = dateTime.toLocaleDateString(language, { weekday: 'long', month: 'short', day: 'numeric' });
  const statsMetrics: StatMetric[] = useMemo(() => {
    const config = [
      { key: 'total_elections', icon: Vote, color: 'primary' as const },
      { key: 'active_voters', icon: UserCheck, color: 'secondary' as const },
      { key: 'total_candidates', icon: Users, color: 'accent' as const },
      { key: 'committees_count', icon: Activity, color: 'success' as const },
    ];

    return config.map((stat) => {
      const statPayload = data?.stats?.[stat.key] ?? { value: 0, change: '0%', trend: 'up' };
      return {
        key: stat.key,
        label: `dashboard.${stat.key}`,
        value: statPayload?.value ?? 0,
        change: statPayload?.change ?? '0%',
        trend: (statPayload?.trend ?? 'up') as 'up' | 'down',
        icon: stat.icon,
        color: stat.color,
      };
    });
  }, [data]);

  // ⏳ التقدم
  const progressData = useMemo(
    () => [
      { label: t('dashboard.registration'), value: data?.progress?.registration ?? 0, color: 'primary' as const },
      { label: t('dashboard.verification'), value: data?.progress?.verification ?? 0, color: 'secondary' as const },
      { label: t('dashboard.campaign'), value: data?.progress?.campaign ?? 0, color: 'accent' as const },
      { label: t('dashboard.voting'), value: data?.progress?.voting ?? 0, color: 'success' as const },
    ],
    [data, t]
  );

  // 🕓 الأنشطة
  const activities = useMemo(
    () =>
      (data?.activities ?? []).map((activity) => ({
        ...activity,
        icon: activityIconMap[activity.type] ?? CheckCircle,
      })),
    [data]
  );

  // 📈 متوسط المشاركة
  const averageTurnout = useMemo(() => {
    const turnoutArray = data?.turnout ?? [];
    if (!turnoutArray.length) return 0;
    return turnoutArray.reduce((sum, v) => sum + v, 0) / turnoutArray.length;
  }, [data]);

  const refreshLabel = language === 'ar' ? 'تحديث الآن' : 'Refresh insights';

  // 🧭 واجهة فارغة
  if (!loading && !data && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>{t('dashboard.no_data', { defaultValue: 'No data available yet' })}</p>
        <Button variant="outline" className="mt-4" onClick={() => refetchDashboard()}>
          <RefreshCcw className="me-2 h-4 w-4" />
          {refreshLabel}
        </Button>
      </div>
    );
  }

  // ============================ واجهة العرض ============================
  return (
    <section dir={direction} className="space-y-4">
      {/* 🎯 الرأس */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#1C3F60] via-[#1C3F60]/95 to-[#0f2740] p-6 sm:p-8 text-white shadow-lg"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Badge className="w-fit bg-[#E7B10A] text-[#1C3F60] shadow-sm">
              {language === 'ar' ? 'لوحة التحكم المتقدمة' : 'Advanced electoral operations'}
            </Badge>
            <h1 className="text-3xl font-semibold sm:text-4xl">{t('dashboard.welcome')}</h1>
            <p className="max-w-xl text-sm text-white/80 sm:text-base">{t('dashboard.subtitle')}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
              <span className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'full' }).format(new Date())}
              </span>
              <span className="rounded-full border border-white/25 px-3 py-1">
                {language === 'ar' ? 'جاهز للعرض التجريبي v1.0.0' : 'Demo-ready release v1.0.0'}
              </span>
            </div>
          </div>
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
      </motion.header>

      {/* 📊 مؤشرات الإحصائيات */}
      <StatsOverview metrics={statsMetrics} loading={loading} />

      {/* 🧩 التقدم والأنشطة */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProgressOverview
            data={progressData}
            loading={loading}
            error={error}
            onRetry={() => refetchDashboard()}
            overall={data?.progress?.overall ?? 0}
            remaining={data?.progress?.remaining ?? 0}
            heading={t('dashboard.election_progress')}
            description={t('dashboard.overall_progress')}
            overallLabel={t('dashboard.overall_progress_label')}
            remainingLabel={t('dashboard.remaining_label')}
          />
        </div>
        <ActivityPanel
          activities={activities}
          loading={loading}
          heading={t('dashboard.recent_activity')}
          description={t('dashboard.view_all_activities')}
        />
      </div>

      {/* 🔹 تغطية ومُلخص */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <LiveOperationsPanel
          loading={loading}
          heading={t('dashboard.voter_turnout')}
          description={
            language === 'ar' ? 'راقب التغطية الميدانية لحظياً' : 'Monitor field coverage in real time'
          }
        />
        <SummaryPanel
          headline={language === 'ar' ? 'مؤشرات التقدم العامة' : 'Overall progress insights'}
          description={
            language === 'ar'
              ? 'تحليلات مجمعة لأداء الفريق الميداني'
              : 'Aggregated insights for field execution'
          }
          overallLabel={t('dashboard.overall_progress')}
          overallValue={data?.progress?.overall ?? 0}
          turnoutLabel={t('dashboard.voter_turnout')}
          turnoutValue={averageTurnout}
          remainingLabel={t('dashboard.days_remaining')}
          remainingValue={data?.progress?.remaining ?? 0}
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{t('dashboard.load_error')}</p>}
    </section>
  );
};