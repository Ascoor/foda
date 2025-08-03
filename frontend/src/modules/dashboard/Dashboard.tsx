import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Vote, UserCheck, Users, Activity, CheckCircle, BarChart3 } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { ActivityFeed } from './components/ActivityFeed';
import { ProgressChart } from './components/ProgressChart';
import { useApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

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
  const { data, loading, error, execute } = useApi<DashboardResponse>({ url: '/dashboard', method: 'GET' });

  useEffect(() => {
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

  const turnout = data?.turnout ?? [];
  const overall = data?.progress?.overall ?? 0;
  const remaining = data?.progress?.remaining ?? 0;

  return (
    <div className="space-y-6">
      {/* رأس الترحيب */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground text-lg">{t('dashboard.subtitle')}</p>
        </div>
      </motion.div>

      {/* شبكة الإحصاءات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 glass-card animate-pulse" />
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

      {/* الرسوم البيانية والنشاط */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* رسم التقدم */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          {loading ? <div className="h-64 glass-card animate-pulse" /> : <ProgressChart data={progressData} overall={overall} remaining={remaining} />}
        </motion.div>

        {/* موجز النشاط */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          {loading ? <div className="h-64 glass-card animate-pulse" /> : <ActivityFeed activities={activities} />}
        </motion.div>
      </div>

      {/* خريطة الإقبال */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">{t('dashboard.voter_turnout')}</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {turnout.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.02 }}
                className={`aspect-square rounded-lg glass-button ${
                  value > 50 ? 'bg-primary/20' : 'bg-muted/20'
                } hover:scale-110 transition-transform cursor-pointer`}
                title={`${t('dashboard.area', { number: i + 1 })}: ${value}%`}
              />
            ))}
          </div>
        )}
      </motion.div>

      {error && <p className="text-destructive text-sm">{t('dashboard.load_error')}</p>}
    </div>
  );
};

