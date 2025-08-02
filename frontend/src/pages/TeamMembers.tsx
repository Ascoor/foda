import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMembers, createMember } from '@/lib/members';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
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
import { useToast } from '@/components/ui/use-toast';

interface Member {
  id: string | number;
  name: string;
  email: string;
  role: string;
}

export const TeamMembers: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['members'], queryFn: fetchMembers });

  const mutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setIsDialogOpen(false);
      toast({ title: language === 'ar' ? 'تم بنجاح' : 'Success' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: language === 'ar' ? 'حدث خطأ' : 'Error' });
    }
  });

  const members: Member[] = (data?.data ?? data ?? []) as Member[];
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="space-y-6 p-6">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
          {t('teams.members')}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="transition-glow hover:neon-glow-blue">
              {language === 'ar' ? 'إضافة عضو' : 'Add Member'}
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
                  {language === 'ar' ? 'إضافة عضو جديد' : 'Create Member'}
                </DialogTitle>
                <DialogDescription className={language === 'ar' ? 'font-arabic' : ''}>
                  {language === 'ar' ? 'أدخل بيانات العضو' : 'Enter member information'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className={language === 'ar' ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </Label>
                  <Input id="name" name="name" required className="glass" />
                </div>
                <div>
                  <Label htmlFor="email" className={language === 'ar' ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </Label>
                  <Input id="email" name="email" type="email" required className="glass" />
                </div>
                <div>
                  <Label htmlFor="role" className={language === 'ar' ? 'font-arabic' : ''}>
                    {language === 'ar' ? 'الدور' : 'Role'}
                  </Label>
                  <Input id="role" name="role" className="glass" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" className="transition-glow hover:neon-glow-blue" disabled={mutation.isLoading}>
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder={t('common.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`glass ${direction === 'rtl' ? 'pr-4' : 'pl-4'} transition-glow focus:neon-glow-blue`}
        />
      </div>

      {isLoading ? (
        <div className={language === 'ar' ? 'font-arabic' : ''}>{t('common.loading')}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className={direction === 'rtl' ? 'flex-row-reverse' : ''}>
              <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
              <TableHead>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
              <TableHead>{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id} className={direction === 'rtl' ? 'flex-row-reverse' : ''}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TeamMembers;
