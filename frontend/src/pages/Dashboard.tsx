import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { HeatmapCard } from '@/components/dashboard/HeatmapCard';
import { useLanguage } from '@/contexts/LanguageContext';

export const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="glass rounded-xl p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <h1 className={`text-3xl font-bold text-foreground mb-2 ${
          language === 'ar' ? 'font-arabic-heading' : ''
        }`}>
          {t('dashboard.welcome')}
        </h1>
        <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <Card className="glass transition-glow hover:neon-glow-blue">
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full glass rounded-lg p-3 text-left transition-glow hover:neon-glow-orange">
              <div className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('campaigns.create')}
              </div>
              <div className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'إنشاء حملة تسويقية جديدة' : 'Create a new marketing campaign'}
              </div>
            </button>
            
            <button className="w-full glass rounded-lg p-3 text-left transition-glow hover:neon-glow-blue">
              <div className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                {t('teams.add_member')}
              </div>
              <div className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'دعوة عضو جديد للفريق' : 'Invite a new team member'}
              </div>
            </button>
            
            <button className="w-full glass rounded-lg p-3 text-left transition-glow hover:neon-glow-orange">
              <div className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'عرض التقارير' : 'View Reports'}
              </div>
              <div className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'مراجعة أداء الحملات' : 'Review campaign performance'}
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass transition-glow hover:neon-glow-blue">
          <CardHeader>
            <CardTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
              {language === 'ar' ? 'أداء الحملات' : 'Campaign Performance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className={`text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
                <div className="text-4xl mb-2">📊</div>
                {language === 'ar' ? 'سيتم إضافة الرسوم البيانية قريباً' : 'Charts coming soon'}
              </div>
            </div>
          </CardContent>
        </Card>

        <HeatmapCard />
      </div>
    </div>
  );
};