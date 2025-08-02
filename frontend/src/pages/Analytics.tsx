import React from 'react';
import { TrendingUp, Users, Target, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const analyticsData = [
  {
    title: 'إجمالي المشاهدات',
    titleEn: 'Total Views',
    value: '2.4M',
    change: '+12.5%',
    icon: Activity,
    trend: 'up'
  },
  {
    title: 'معدل التحويل',
    titleEn: 'Conversion Rate',
    value: '3.2%',
    change: '+0.8%',
    icon: Target,
    trend: 'up'
  },
  {
    title: 'المستخدمون النشطون',
    titleEn: 'Active Users',
    value: '1.8K',
    change: '+15.3%',
    icon: Users,
    trend: 'up'
  },
  {
    title: 'متوسط الجلسة',
    titleEn: 'Avg. Session',
    value: '4m 32s',
    change: '-2.1%',
    icon: Calendar,
    trend: 'down'
  }
];

const campaignMetrics = [
  {
    name: 'حملة التسويق الرقمي',
    nameEn: 'Digital Marketing Campaign',
    impressions: '125K',
    clicks: '3.2K',
    ctr: '2.56%',
    cost: '15,000 ريال',
    status: 'active'
  },
  {
    name: 'إطلاق المنتج الجديد',
    nameEn: 'New Product Launch',
    impressions: '89K',
    clicks: '2.1K',
    ctr: '2.36%',
    cost: '12,500 ريال',
    status: 'active'
  },
  {
    name: 'حملة وسائل التواصل',
    nameEn: 'Social Media Campaign',
    impressions: '67K',
    clicks: '1.8K',
    ctr: '2.69%',
    cost: '8,000 ريال',
    status: 'completed'
  }
];

export const Analytics: React.FC = () => {
  const { language, direction, t } = useLanguage();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
          {t('nav.analytics')}
        </h1>
        <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
          {language === 'ar' ? 'تحليل أداء الحملات والمقاييس الرئيسية' : 'Campaign performance analysis and key metrics'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="glass transition-glow hover:neon-glow-blue">
              <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${
                direction === 'rtl' ? 'flex-row-reverse' : ''
              }`}>
                <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? metric.title : metric.titleEn}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
                  {metric.value}
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  direction === 'rtl' ? 'flex-row-reverse' : ''
                }`}>
                  <TrendingUp className={`h-3 w-3 ${
                    metric.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`} />
                  <Badge 
                    variant={metric.trend === 'up' ? 'default' : 'destructive'} 
                    className="text-xs"
                  >
                    {metric.change}
                  </Badge>
                  <span className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass transition-glow hover:neon-glow-orange">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
              <BarChart3 className="h-5 w-5 text-primary" />
              {language === 'ar' ? 'اتجاهات الأداء' : 'Performance Trends'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className={`text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
                <div className="text-6xl mb-4">📈</div>
                <p className="text-lg font-medium">
                  {language === 'ar' ? 'الرسوم البيانية التفاعلية' : 'Interactive Charts'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'سيتم إضافتها قريباً' : 'Coming Soon'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass transition-glow hover:neon-glow-blue">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
              <PieChart className="h-5 w-5 text-secondary" />
              {language === 'ar' ? 'توزيع الجمهور' : 'Audience Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className={`text-center ${language === 'ar' ? 'font-arabic' : ''}`}>
                <div className="text-6xl mb-4">🥧</div>
                <p className="text-lg font-medium">
                  {language === 'ar' ? 'تحليل الشرائح' : 'Segment Analysis'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'سيتم إضافتها قريباً' : 'Coming Soon'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card className="glass transition-glow hover:neon-glow-orange">
        <CardHeader>
          <CardTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
            {language === 'ar' ? 'أداء الحملات' : 'Campaign Performance'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignMetrics.map((campaign, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 glass rounded-lg transition-glow hover:neon-glow-blue ${
                  direction === 'rtl' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {language === 'ar' ? campaign.name : campaign.nameEn}
                  </h3>
                  <div className={`flex gap-4 mt-2 text-sm text-muted-foreground ${
                    direction === 'rtl' ? 'flex-row-reverse' : ''
                  }`}>
                    <span className={language === 'ar' ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'المشاهدات: ' : 'Impressions: '}{campaign.impressions}
                    </span>
                    <span className={language === 'ar' ? 'font-arabic' : ''}>
                      {language === 'ar' ? 'النقرات: ' : 'Clicks: '}{campaign.clicks}
                    </span>
                    <span className={language === 'ar' ? 'font-arabic' : ''}>
                      CTR: {campaign.ctr}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className={`text-right ${direction === 'rtl' ? 'text-left' : ''}`}>
                    <p className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {campaign.cost}
                    </p>
                    <Badge 
                      variant={campaign.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {language === 'ar' 
                        ? (campaign.status === 'active' ? 'نشطة' : 'مكتملة')
                        : campaign.status
                      }
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};