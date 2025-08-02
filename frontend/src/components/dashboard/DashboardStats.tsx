import React from 'react';
import { TrendingUp, TrendingDown, Users, Target, BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  description 
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
        <div className={`flex items-center gap-1 text-xs text-muted-foreground ${
          direction === 'rtl' ? 'flex-row-reverse' : ''
        }`}>
          {changeType === 'increase' ? (
            <TrendingUp className="h-3 w-3 text-success" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <Badge 
            variant={changeType === 'increase' ? 'default' : 'destructive'} 
            className="text-xs"
          >
            {change}
          </Badge>
          {description && (
            <span className={`${language === 'ar' ? 'font-arabic' : ''}`}>
              {description}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardStats: React.FC = () => {
  const { t, language } = useLanguage();

  const stats = [
    {
      title: t('dashboard.total_campaigns'),
      value: '24',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Target,
      description: language === 'ar' ? 'من الشهر الماضي' : 'from last month'
    },
    {
      title: t('dashboard.active_campaigns'),
      value: '8',
      change: '+5%',
      changeType: 'increase' as const,
      icon: BarChart3,
      description: language === 'ar' ? 'قيد التشغيل' : 'currently running'
    },
    {
      title: t('dashboard.team_members'),
      value: '156',
      change: '+23',
      changeType: 'increase' as const,
      icon: Users,
      description: language === 'ar' ? 'عضو نشط' : 'active members'
    },
    {
      title: t('dashboard.completion_rate'),
      value: '89%',
      change: '+3%',
      changeType: 'increase' as const,
      icon: Calendar,
      description: language === 'ar' ? 'معدل النجاح' : 'success rate'
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};