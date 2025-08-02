import React, { useState } from 'react';
import { Plus, Search, UserPlus, MoreHorizontal, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useLanguage } from '@/contexts/LanguageContext';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  initials: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  lead: string;
}

const teams: Team[] = [
  {
    id: '1',
    name: 'فريق التسويق',
    description: 'فريق متخصص في التسويق الرقمي والحملات الإعلانية',
    lead: 'أحمد محمد',
    members: [
      {
        id: '1',
        name: 'أحمد محمد',
        role: 'مدير التسويق',
        email: 'ahmed@fahsan.com',
        phone: '+966501234567',
        location: 'الرياض',
        initials: 'أم',
        status: 'active',
        joinDate: '2023-01-15'
      },
      {
        id: '2',
        name: 'فاطمة أحمد',
        role: 'أخصائي وسائل التواصل',
        email: 'fatima@fahsan.com',
        phone: '+966507654321',
        location: 'جدة',
        initials: 'فأ',
        status: 'active',
        joinDate: '2023-03-20'
      },
      {
        id: '3',
        name: 'محمد علي',
        role: 'مصمم جرافيك',
        email: 'mohammed@fahsan.com',
        location: 'الدمام',
        initials: 'مع',
        status: 'active',
        joinDate: '2023-05-10'
      }
    ]
  },
  {
    id: '2',
    name: 'فريق المنتجات',
    description: 'فريق تطوير وإدارة المنتجات الرقمية',
    lead: 'سارة خالد',
    members: [
      {
        id: '4',
        name: 'سارة خالد',
        role: 'مدير المنتجات',
        email: 'sara@fahsan.com',
        phone: '+966509876543',
        location: 'الرياض',
        initials: 'سخ',
        status: 'active',
        joinDate: '2023-02-01'
      },
      {
        id: '5',
        name: 'خالد عبدالله',
        role: 'مطور واجهات',
        email: 'khalid@fahsan.com',
        location: 'جدة',
        initials: 'خع',
        status: 'active',
        joinDate: '2023-04-15'
      }
    ]
  }
];

export const Teams: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
            {t('teams.title')}
          </h1>
          <p className={`text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'إدارة الفرق وأعضاء المؤسسة' : 'Manage teams and organization members'}
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="transition-glow hover:neon-glow-orange">
              <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              <span className={language === 'ar' ? 'font-arabic' : ''}>
                {t('teams.create')}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
                {t('teams.create')}
              </DialogTitle>
              <DialogDescription className={language === 'ar' ? 'font-arabic' : ''}>
                {language === 'ar' ? 'أنشئ فريق عمل جديد' : 'Create a new work team'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'اسم الفريق' : 'Team Name'}
                </Label>
                <Input className="glass" />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'الوصف' : 'Description'}
                </Label>
                <Input className="glass" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {t('common.cancel')}
                </span>
              </Button>
              <Button className="transition-glow hover:neon-glow-orange">
                <span className={language === 'ar' ? 'font-arabic' : ''}>
                  {t('common.create')}
                </span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
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

      {/* Teams Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="glass transition-glow hover:neon-glow-orange">
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-4 ${
              direction === 'rtl' ? 'flex-row-reverse' : ''
            }`}>
              <div>
                <CardTitle className={`text-xl ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
                  {team.name}
                </CardTitle>
                <p className={`text-sm text-muted-foreground mt-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {team.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass" align={direction === 'rtl' ? 'start' : 'end'}>
                  <DropdownMenuItem className={`transition-glow hover:neon-glow-blue ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <UserPlus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    {t('teams.add_member')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className={`transition-glow hover:neon-glow-orange ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t('common.edit')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <span className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t('teams.members')}
                </span>
                <Badge variant="secondary">
                  {team.members.length} {language === 'ar' ? 'عضو' : 'members'}
                </Badge>
              </div>

              <div className="space-y-3">
                {team.members.slice(0, 3).map((member) => (
                  <div 
                    key={member.id} 
                    className={`flex items-center gap-3 p-2 rounded-lg glass transition-glow hover:neon-glow-blue ${
                      direction === 'rtl' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {member.name}
                      </p>
                      <p className={`text-xs text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {member.role}
                      </p>
                    </div>
                    <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {member.email && (
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Mail className="h-3 w-3" />
                        </Button>
                      )}
                      {member.phone && (
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Phone className="h-3 w-3" />
                        </Button>
                      )}
                      {member.location && (
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MapPin className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {team.members.length > 3 && (
                  <Button 
                    variant="ghost" 
                    className={`w-full text-sm transition-glow hover:neon-glow-orange ${language === 'ar' ? 'font-arabic' : ''}`}
                    onClick={() => setSelectedTeam(team)}
                  >
                    {language === 'ar' ? `عرض جميع الأعضاء (${team.members.length})` : `View all members (${team.members.length})`}
                  </Button>
                )}
              </div>

              <div className={`pt-2 border-t border-border/50 ${language === 'ar' ? 'font-arabic' : ''}`}>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'قائد الفريق: ' : 'Team Lead: '}
                  <span className="font-medium text-foreground">{team.lead}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Details Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="glass max-w-2xl">
          <DialogHeader>
            <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
              {selectedTeam?.name}
            </DialogTitle>
            <DialogDescription className={language === 'ar' ? 'font-arabic' : ''}>
              {selectedTeam?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedTeam?.members.map((member) => (
              <div 
                key={member.id} 
                className={`flex items-center gap-4 p-3 rounded-lg glass transition-glow hover:neon-glow-blue ${
                  direction === 'rtl' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {member.name}
                  </p>
                  <p className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {member.role}
                  </p>
                  <p className={`text-xs text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {member.email}
                  </p>
                  {member.location && (
                    <div className={`flex items-center gap-1 text-xs text-muted-foreground mt-1 ${
                      direction === 'rtl' ? 'flex-row-reverse' : ''
                    }`}>
                      <MapPin className="h-3 w-3" />
                      <span className={language === 'ar' ? 'font-arabic' : ''}>{member.location}</span>
                    </div>
                  )}
                </div>
                <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                  {language === 'ar' ? (member.status === 'active' ? 'نشط' : 'غير نشط') : member.status}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};