import React, { useEffect, useState } from 'react';
import { Map, UserPlus, UserCheck, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
}

interface HomeStats {
  areas: number;
  volunteers: number;
  voters: number;
  teams: number;
  events: number;
  registrations: Array<{ month: string; count: number }>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
}) => {
  const { direction, language } = useLanguage();

  return (
    <Card className="glass transition-glow hover:neon-glow-blue">
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${
        direction === 'rtl' ? 'flex-row-reverse' : ''
      }`}>
        <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardStats: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/home')
      .then((res) => {
        if (!res.ok) throw new Error('error');
        return res.json();
      })
      .then((data) => setStats(data.data))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  const statCards = [
    { title: t('dashboard.areas'), value: stats?.areas ?? 0, icon: Map },
    { title: t('dashboard.volunteers'), value: stats?.volunteers ?? 0, icon: UserPlus },
    { title: t('dashboard.voters'), value: stats?.voters ?? 0, icon: UserCheck },
    { title: t('dashboard.teams'), value: stats?.teams ?? 0, icon: Users },
    { title: t('dashboard.events'), value: stats?.events ?? 0, icon: Calendar },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};