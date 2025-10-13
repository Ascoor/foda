import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Vote, UserCheck, Users, Activity, CheckCircle, CalendarCheck, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ActivityPanel, LiveOperationsPanel, ProgressOverview, StatsOverview, SummaryPanel } from './DashboardWidgets';

// تعريف الأنواع للأنشطة (Activity)
interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
}

// تعريف الأنواع للأنشطة التي تحتوي على `icon`
interface ActivityItem {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: React.ComponentType<LucideProps>; // إضافة الخاصية icon من نوع React.ComponentType
}

// تعريف أنواع الألوان الممكنة
type Color = 'primary' | 'secondary' | 'accent' | 'success';

const EnhancedDashboard = () => {
  const { t, i18n } = useTranslation();
  const { direction, language } = useLanguage();
  const { data, loading, error, execute: refetchDashboard } = useApi({ url: '/dashboard', method: 'GET' });

  const dashboardData = data ?? {
    stats: {},
    activities: [],
    progress: { registration: 0, verification: 0, campaign: 0, voting: 0, overall: 0, remaining: 0 },
    turnout: [],
  };

  // 🧮 الإحصائيات
  const statsMetrics = useMemo(() => {
    const config = [
      { key: 'total_elections', icon: Vote, color: 'primary' as Color },
      { key: 'active_voters', icon: UserCheck, color: 'secondary' as Color },
      { key: 'total_candidates', icon: Users, color: 'accent' as Color },
      { key: 'committees_count', icon: Activity, color: 'success' as Color },
    ];

    return config.map((stat) => {
      const statPayload = dashboardData.stats[stat.key] ?? { value: 0, change: '0%', trend: 'up' };
      return {
        key: stat.key,
        label: `dashboard.${stat.key}`,
        value: statPayload.value ?? 0,
        change: statPayload.change ?? '0%',
        trend: statPayload.trend ?? 'up',
        icon: stat.icon,
        color: stat.color,
      };
    });
  }, [dashboardData.stats]);

  // ⏳ التقدم
  const progressData = useMemo(() => [
    { label: t('dashboard.registration'), value: dashboardData.progress.registration, color: 'primary' },
    { label: t('dashboard.verification'), value: dashboardData.progress.verification, color: 'secondary' },
    { label: t('dashboard.campaign'), value: dashboardData.progress.campaign, color: 'accent' },
    { label: t('dashboard.voting'), value: dashboardData.progress.voting, color: 'success' },
  ], [dashboardData.progress, t]);

  // 🕓 الأنشطة
  const activities: ActivityItem[] = useMemo(() => (dashboardData.activities ?? []).map((activity: Activity) => ({
    ...activity,
    icon: CheckCircle,  // تأكد من أن كل نشاط يحتوي على `icon`
  })), [dashboardData.activities]);

  // 📈 متوسط المشاركة
  const averageTurnout = useMemo(() => {
    const turnoutArray = dashboardData.turnout;
    return turnoutArray.length
      ? turnoutArray.reduce((sum: number, v: number) => sum + v, 0) / turnoutArray.length
      : 0;
  }, [dashboardData.turnout]);

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
                .catch(() =>
                  toast({ variant: 'destructive', description: t('dashboard.load_error') })
                )
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
            overall={dashboardData.progress.overall}
            remaining={dashboardData.progress.remaining}
            heading={t('dashboard.election_progress')}
            description={t('dashboard.overall_progress')}
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
          description={language === 'ar' ? 'راقب التغطية الميدانية لحظياً' : 'Monitor field coverage in real time'}
        />
        <SummaryPanel
          headline={language === 'ar' ? 'مؤشرات التقدم العامة' : 'Overall progress insights'}
          description={language === 'ar' ? 'تحليلات مجمعة لأداء الفريق الميداني' : 'Aggregated insights for field execution'}
          overallLabel={t('dashboard.overall_progress')}
          overallValue={dashboardData.progress.overall}
          turnoutLabel={t('dashboard.voter_turnout')}
          turnoutValue={averageTurnout}
          remainingLabel={t('dashboard.days_remaining')}
          remainingValue={dashboardData.progress.remaining}
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{t('dashboard.load_error')}</p>}
    </section>
  );
};

export default EnhancedDashboard;
