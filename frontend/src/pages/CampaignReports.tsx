import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar, 
  Filter, 
  Search,
  TrendingUp,
  Users,
  Target,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface CampaignReport {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'active' | 'paused';
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  roas: number;
}

const campaignReports: CampaignReport[] = [
  {
    id: '1',
    name: 'حملة التسويق الرقمي Q1',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'completed',
    impressions: 125000,
    clicks: 3200,
    conversions: 280,
    spend: 15000,
    roas: 4.2
  },
  {
    id: '2',
    name: 'إطلاق المنتج الجديد',
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    status: 'active',
    impressions: 89000,
    clicks: 2100,
    conversions: 185,
    spend: 12500,
    roas: 3.8
  },
  {
    id: '3',
    name: 'حملة وسائل التواصل',
    startDate: '2023-12-01',
    endDate: '2024-01-31',
    status: 'completed',
    impressions: 67000,
    clicks: 1800,
    conversions: 165,
    spend: 8000,
    roas: 5.1
  }
];

export const CampaignReports: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(num);
  };

  const filteredReports = campaignReports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'active':
        return 'bg-primary text-white';
      case 'paused':
        return 'bg-warning text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'ar') {
      switch (status) {
        case 'completed': return 'مكتملة';
        case 'active': return 'نشطة';
        case 'paused': return 'متوقفة';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
            {t('campaigns.reports')}
          </h1>
          <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' 
              ? 'تقارير مفصلة عن أداء جميع الحملات التسويقية' 
              : 'Detailed performance reports for all marketing campaigns'
            }
          </p>
        </div>
        
        <Button className="glass transition-glow hover:neon-glow-blue">
          <Download className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          <span className={language === 'ar' ? 'font-arabic' : ''}>
            {t('common.export')}
          </span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass transition-glow hover:neon-glow-blue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'إجمالي المشاهدات' : 'Total Impressions'}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
              {formatNumber(281000)}
            </div>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass transition-glow hover:neon-glow-orange">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'إجمالي النقرات' : 'Total Clicks'}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
              {formatNumber(7100)}
            </div>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass transition-glow hover:neon-glow-blue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'إجمالي التحويلات' : 'Total Conversions'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
              {formatNumber(630)}
            </div>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+15.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass transition-glow hover:neon-glow-orange">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'متوسط العائد' : 'Average ROAS'}
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
              4.37x
            </div>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>+6.8%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className={`flex gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${
            direction === 'rtl' ? 'right-3' : 'left-3'
          }`} />
          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`glass ${direction === 'rtl' ? 'pr-9' : 'pl-9'} transition-glow focus:neon-glow-blue`}
          />
        </div>
        <Button variant="outline" className="glass transition-glow hover:neon-glow-orange">
          <Filter className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          <span className={language === 'ar' ? 'font-arabic' : ''}>
            {t('common.filter')}
          </span>
        </Button>
        <Button variant="outline" className="glass transition-glow hover:neon-glow-blue">
          <Calendar className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          <span className={language === 'ar' ? 'font-arabic' : ''}>
            {language === 'ar' ? 'تاريخ محدد' : 'Date Range'}
          </span>
        </Button>
      </div>

      {/* Reports Table */}
      <Card className="glass transition-glow hover:neon-glow-blue">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
            <FileText className="h-5 w-5 text-primary" />
            {language === 'ar' ? 'تقارير الحملات التفصيلية' : 'Detailed Campaign Reports'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div 
                key={report.id}
                className={`glass rounded-lg p-4 transition-glow hover:neon-glow-orange`}
              >
                <div className={`flex items-center justify-between mb-4 ${
                  direction === 'rtl' ? 'flex-row-reverse' : ''
                }`}>
                  <div>
                    <h3 className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {report.name}
                    </h3>
                    <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'من' : 'From'} {report.startDate} {language === 'ar' ? 'إلى' : 'to'} {report.endDate}
                    </p>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {getStatusText(report.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'المشاهدات' : 'Impressions'}
                    </p>
                    <p className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {formatNumber(report.impressions)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'النقرات' : 'Clicks'}
                    </p>
                    <p className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {formatNumber(report.clicks)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'التحويلات' : 'Conversions'}
                    </p>
                    <p className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {formatNumber(report.conversions)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {language === 'ar' ? 'الإنفاق' : 'Spend'}
                    </p>
                    <p className={`font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {formatNumber(report.spend)} {language === 'ar' ? 'ريال' : 'SAR'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                      ROAS
                    </p>
                    <p className={`font-semibold text-success ${language === 'ar' ? 'font-arabic' : ''}`}>
                      {report.roas}x
                    </p>
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