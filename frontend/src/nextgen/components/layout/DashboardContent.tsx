import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AreaChartCard, TrendPoint } from "./charts/AreaChart";
import { BarChartCard, BarSegment } from "./charts/BarChart";
import { LineChartCard, TurnoutPoint } from "./charts/LineChart";
import { PieChartCard, DistributionSlice } from "./charts/PieChart";
import { GlassCard } from "./GlassCard";
import { MapSection, MapPoint } from "./MapSection";

export interface OverviewCard {
  id: string;
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  gradient: string;
}

interface DashboardContentProps {
  overviewCards: OverviewCard[];
  turnoutData: TurnoutPoint[];
  progressDistribution: DistributionSlice[];
  registrationTrend: TrendPoint[];
  activitySummary: BarSegment[];
  overallProgress: number;
  remainingProgress: number;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  mapPoints: MapPoint[];
  mapLoading: boolean;
  mapError?: string | null;
  onMapRetry?: () => void;
}

const OverviewSkeleton = () => (
  <div className="animate-pulse rounded-3xl border border-white/10 bg-white/40 p-6 shadow-inner backdrop-blur-xl dark:bg-slate-900/40">
    <div className="space-y-4">
      <div className="h-3 w-24 rounded-full bg-slate-200/70 dark:bg-slate-700/60" />
      <div className="h-6 w-32 rounded-full bg-slate-200/80 dark:bg-slate-700/70" />
      <div className="h-4 w-20 rounded-full bg-slate-200/60 dark:bg-slate-700/50" />
    </div>
  </div>
);

export const DashboardContent = ({
  overviewCards,
  turnoutData,
  progressDistribution,
  registrationTrend,
  activitySummary,
  overallProgress,
  remainingProgress,
  loading,
  error,
  onRetry,
  mapPoints,
  mapLoading,
  mapError,
  onMapRetry,
}: DashboardContentProps) => {
  const { t } = useTranslation("floating");

  const renderChange = (change?: string) => {
    if (!change) return null;
    const isNegative = change.trim().startsWith("-");
    const changeColor = isNegative
      ? "bg-rose-500/10 text-rose-600 dark:text-rose-300"
      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${changeColor} dark:bg-slate-800/60`}
      >
        {change}
      </span>
    );
  };

  const overviewContent = () => {
    if (loading) {
      const skeletonCount = overviewCards.length > 0 ? overviewCards.length : 4;
      return Array.from({ length: skeletonCount }).map((_, index) => <OverviewSkeleton key={`skeleton-${index}`} />);
    }

    if (!overviewCards.length) {
      return (
        <GlassCard>
          <div className="flex flex-col items-center gap-3 text-center text-sm text-slate-600 dark:text-slate-300">
            <p>{t("dashboard.noStats", "لا توجد بيانات إحصائية حالياً")}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-full border border-white/40 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-white dark:bg-slate-800/70 dark:text-slate-100"
              >
                {t("dashboard.retry", "إعادة المحاولة")}
              </button>
            )}
          </div>
        </GlassCard>
      );
    }

    return overviewCards.map(({ id, title, value, change, icon: Icon, gradient }) => (
      <GlassCard key={id} className="overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
            {renderChange(change)}
          </div>
          <div
            className={`rounded-3xl bg-gradient-to-br ${gradient} p-5 text-white shadow-[0_0_35px_rgba(59,130,246,0.35)]`}
          >
            <Icon className="size-8" />
          </div>
        </div>
      </GlassCard>
    ));
  };

  return (
    <motion.main layout className="relative flex-1 space-y-8">
      <section id="analytics" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {overviewContent()}
      </section>

      {!loading && error && (
        <GlassCard className="border-2 border-rose-200/60 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/30">
          <div className="space-y-4 text-center">
            <p className="text-sm font-medium text-rose-600 dark:text-rose-300">
              {t("dashboard.errorLoading", "تعذر تحميل بيانات لوحة التحكم")}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-rose-600"
              >
                {t("dashboard.retry", "إعادة المحاولة")}
              </button>
            )}
          </div>
        </GlassCard>
      )}

      <div id="layers" className="grid gap-6 md:grid-cols-2">
        <LineChartCard
          title={t("dashboard.charts.turnoutTitle", "منحنى المشاركة")}
          description={t("dashboard.charts.turnoutDescription", "تطور نسبة التصويت مع قياس الزخم.")}
          data={turnoutData}
          emptyMessage={t("dashboard.noData", "لا توجد بيانات متاحة")}
          isLoading={loading}
        />
        <PieChartCard
          title={t("dashboard.charts.progressTitle", "توزيع مراحل الحملة")}
          description={t("dashboard.charts.progressDescription", "مقارنة نسب التقدم في مراحل التسجيل والحملة.")}
          data={progressDistribution}
          emptyMessage={t("dashboard.noData", "لا توجد بيانات متاحة")}
          isLoading={loading}
        />
        <AreaChartCard
          title={t("dashboard.charts.registrationTitle", "اتجاهات التسجيل")}
          description={t("dashboard.charts.registrationDescription", "تحليل تطور تسجيل الناخبين والأنشطة المصاحبة.")}
          data={registrationTrend}
          emptyMessage={t("dashboard.noData", "لا توجد بيانات متاحة")}
          isLoading={loading}
        />
        <BarChartCard
          title={t("dashboard.charts.activitiesTitle", "أنماط الأنشطة")}
          description={t("dashboard.charts.activitiesDescription", "حجم الأنشطة الميدانية حسب النوع.")}
          data={activitySummary}
          emptyMessage={t("dashboard.noData", "لا توجد بيانات متاحة")}
          isLoading={loading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard className="flex flex-col justify-between" title={t("dashboard.overallProgress", "مؤشر التقدم العام")}
          description={t("dashboard.overallProgressDescription", "نظرة سريعة على التقدم الإجمالي للحملة.")}
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                {t("dashboard.overall", "إجمالي الإنجاز")}
              </p>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{`${Math.round(overallProgress)}%`}</p>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                {t("dashboard.remaining", "المتبقي")}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{`${Math.round(remainingProgress)}%`}</p>
            </div>
          </div>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/60 dark:bg-slate-800/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 transition-all"
              style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
            />
          </div>
        </GlassCard>

        <MapSection
          title={t("dashboard.mapTitle", "خريطة نقاط التأثير")}
          description={t("dashboard.mapSubtitle", "تعرّف على توزيع النشاط الميداني ومستويات الدعم.")}
          emptyMessage={t("dashboard.mapEmpty", "لا توجد نقاط نشطة لعرضها حالياً")}
          points={mapPoints}
          isLoading={mapLoading}
          error={mapError}
          onRetry={onMapRetry}
        />
      </div>
    </motion.main>
  );
};
