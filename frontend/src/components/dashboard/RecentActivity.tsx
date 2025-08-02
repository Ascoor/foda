import React from 'react';
import { Clock, User, Megaphone, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ActivityItem {
  id: string;
  type: 'campaign_created' | 'campaign_completed' | 'team_joined' | 'task_completed';
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'campaign_created',
    user: { name: 'أحمد محمد', initials: 'أم' },
    title: 'تم إنشاء حملة جديدة',
    description: 'حملة التسويق الرقمي Q1 2024',
    timestamp: 'منذ 5 دقائق',
    status: 'success'
  },
  {
    id: '2',
    type: 'campaign_completed',
    user: { name: 'فاطمة أحمد', initials: 'فأ' },
    title: 'تم إكمال الحملة',
    description: 'حملة وسائل التواصل الاجتماعي',
    timestamp: 'منذ 15 دقيقة',
    status: 'success'
  },
  {
    id: '3',
    type: 'team_joined',
    user: { name: 'محمد علي', initials: 'مع' },
    title: 'انضم عضو جديد للفريق',
    description: 'فريق التصميم والإبداع',
    timestamp: 'منذ 30 دقيقة',
    status: 'info'
  },
  {
    id: '4',
    type: 'task_completed',
    user: { name: 'سارة خالد', initials: 'سخ' },
    title: 'تم إنجاز مهمة',
    description: 'مراجعة محتوى الحملة الإعلانية',
    timestamp: 'منذ ساعة',
    status: 'success'
  }
];

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'campaign_created':
      return Megaphone;
    case 'campaign_completed':
      return CheckCircle;
    case 'team_joined':
      return User;
    case 'task_completed':
      return CheckCircle;
    default:
      return AlertCircle;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'success':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'info':
      return 'text-info';
    default:
      return 'text-muted-foreground';
  }
};

export const RecentActivity: React.FC = () => {
  const { direction, language, t } = useLanguage();

  return (
    <Card className="glass transition-glow hover:neon-glow-orange">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
          <Clock className="h-5 w-5 text-primary" />
          {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          
          return (
            <div 
              key={activity.id} 
              className={`flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0 ${
                direction === 'rtl' ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {activity.user.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1 min-w-0">
                <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Icon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                  <p className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {activity.title}
                  </p>
                </div>
                <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {activity.description}
                </p>
                <div className={`flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Badge variant="outline" className="text-xs">
                    {activity.user.name}
                  </Badge>
                  <span className={`text-xs text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};