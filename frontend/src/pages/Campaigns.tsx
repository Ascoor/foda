import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Play, Pause, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  startDate: string;
  endDate: string;
  budget: string;
  team: string;
}

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'حملة التسويق الرقمي Q1',
    description: 'حملة شاملة للتسويق الرقمي للربع الأول من العام',
    status: 'active',
    progress: 65,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    budget: '50,000 ريال',
    team: 'فريق التسويق'
  },
  {
    id: '2',
    name: 'إطلاق المنتج الجديد',
    description: 'حملة إطلاق المنتج الجديد مع استراتيجية متكاملة',
    status: 'paused',
    progress: 35,
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    budget: '75,000 ريال',
    team: 'فريق المنتجات'
  },
  {
    id: '3',
    name: 'حملة وسائل التواصل',
    description: 'تعزيز الحضور على منصات التواصل الاجتماعي',
    status: 'completed',
    progress: 100,
    startDate: '2023-12-01',
    endDate: '2024-01-31',
    budget: '30,000 ريال',
    team: 'فريق المحتوى'
  }
];

const getStatusColor = (status: Campaign['status']) => {
  switch (status) {
    case 'active':
      return 'bg-success text-white';
    case 'paused':
      return 'bg-warning text-white';
    case 'completed':
      return 'bg-info text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const Campaigns: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
            {t('campaigns.title')}
          </h1>
          <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة وتتبع جميع حملاتك التسويقية' : 'Manage and track all your marketing campaigns'}
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="transition-glow hover:neon-glow-blue">
              <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              <span className={language === 'ar' ? 'font-arabic' : ''}>
                {t('campaigns.create')}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
                {t('campaigns.create')}
              </DialogTitle>
              <DialogDescription className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'أنشئ حملة تسويقية جديدة' : 'Create a new marketing campaign'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'اسم الحملة' : 'Campaign Name'}
                </Label>
                <Input className="glass" />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </Label>
                <Textarea className="glass" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {t('common.cancel')}
                </span>
              </Button>
              <Button className="transition-glow hover:neon-glow-blue">
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {t('common.create')}
                </span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="glass transition-glow hover:neon-glow-blue">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${
              direction === 'rtl' ? 'flex-row-reverse' : ''
            }`}>
              <CardTitle className={`text-lg ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
                {campaign.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass" align={direction === 'rtl' ? 'start' : 'end'}>
                  <DropdownMenuItem className={`transition-glow hover:neon-glow-blue ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Eye className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    {language === 'ar' ? 'عرض' : 'View'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className={`transition-glow hover:neon-glow-orange ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Edit className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    {t('common.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className={`transition-glow hover:neon-glow-blue ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {campaign.status === 'active' ? (
                      <>
                        <Pause className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                        {language === 'ar' ? 'إيقاف' : 'Pause'}
                      </>
                    ) : (
                      <>
                        <Play className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                        {language === 'ar' ? 'تشغيل' : 'Start'}
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className={`text-destructive transition-glow hover:bg-destructive hover:text-destructive-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <Trash2 className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                {campaign.description}
              </p>
              
              <div className="space-y-2">
                <div className={`flex justify-between text-sm ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <span className={language === 'ar' ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'التقدم' : 'Progress'}
                  </span>
                  <span className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {campaign.progress}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Badge className={getStatusColor(campaign.status)}>
                    {t(`campaigns.status.${campaign.status}`)}
                  </Badge>
                  <span className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {campaign.budget}
                  </span>
                </div>
                <div className={`text-xs text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {language === 'ar' ? 'الفريق: ' : 'Team: '}{campaign.team}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};