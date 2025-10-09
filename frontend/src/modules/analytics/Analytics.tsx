import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, GaugeCircle, Signal, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeDataRenderer } from '@/components/ui/SafeDataRenderer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { fetchAnalytics } from './api';
import type { AnalyticsResponse } from './types';

const DashboardCharts = lazy(() =>
  import('./DashboardCharts').then((module) => ({ default: module.DashboardCharts })),
);

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

const MetricCard = ({ label, value, helper, icon, highlight = false }: MetricCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
  >
    <Card className={`glass-card border-primary/20 ${highlight ? 'shadow-lg shadow-primary/20' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-gradient-primary">{value}</p>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-primary/70" />
          {helper}
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

export const Analytics = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const payload = await fetchAnalytics();
        setAnalytics(payload);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load analytics';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const metrics = useMemo(() => {
    if (!analytics) return [];

    const { support_percentage, turnout_estimate, coverage_gap } = analytics.summary;

    return [
      {
        label: t('analytics.supportScore', 'Support sentiment'),
        value: `${support_percentage.toFixed(1)}%`,
        helper: t('analytics.supportHelper', 'Average support score from field reports'),
        icon: <TrendingUp className="h-4 w-4" />,
        highlight: true,
      },
      {
        label: t('analytics.turnoutEstimate', 'Turnout estimate'),
        value: `${turnout_estimate.toFixed(1)}%`,
        helper: t('analytics.turnoutHelper', 'Projected turnout based on active agents'),
        icon: <GaugeCircle className="h-4 w-4" />,
      },
      {
        label: t('analytics.coverageGap', 'Coverage gap'),
        value: `${coverage_gap.toFixed(1)}%`,
        helper: t('analytics.coverageHelper', 'Remaining precincts that need field agents'),
        icon: <Signal className="h-4 w-4" />,
      },
    ];
  }, [analytics, t]);

  const hasData = analytics && analytics.regions.length > 0;

  return (
    <SafeDataRenderer
      data={hasData ? [analytics] : []}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
      emptyTitle={t('analytics.emptyTitle', 'Analytics data is coming soon')}
      emptyDescription={t(
        'analytics.emptyDescription',
        'Once activities are logged you will see field intelligence in real time.',
      )}
    >
      {() => (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary">
                {t('analytics.title', 'Operations analytics')}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {t(
                  'analytics.subtitle',
                  'Track agent coverage, support momentum, and live field activity across regions.',
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {t('analytics.updated', 'Updated')}: {new Date(analytics!.generated_at).toLocaleString()}
              </span>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                {t('common.refresh', 'Refresh')}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            <div className="grid gap-4 md:grid-cols-3">
              {metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </AnimatePresence>

          <Suspense
            fallback={
              <div className="grid gap-6 lg:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <Card key={`chart-skeleton-${index}`} className="glass-card border-muted/40">
                    <CardHeader>
                      <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-[280px] w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <DashboardCharts
              regions={analytics!.regions}
              trends={analytics!.support_trends}
              distribution={analytics!.report_distribution}
            />
          </Suspense>
        </div>
      )}
    </SafeDataRenderer>
  );
};
