import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { VolunteerForm } from '@/components/Volunteer/VolunteerForm';
import { VolunteerTable } from '@/components/Volunteer/VolunteerTable';
import { VolunteerPayload } from '@/lib/volunteers';
import { useVolunteers } from '@/hooks/useVolunteers';

interface Volunteer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  team?: { id: number | null; name: string | null };
}

const Volunteers: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [search, setSearch] = useState('');
  const { data, isLoading, error, create, update, remove: removeMutation } = useVolunteers(search);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState<VolunteerPayload>({ name: '', email: '', phone: '', team_id: null });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', team_id: null });
    setDialogOpen(true);
  };

  const openEdit = (vol: Volunteer) => {
    setEditing(vol);
    setForm({
      name: vol.name,
      email: vol.email || '',
      phone: vol.phone || '',
      team_id: vol.team?.id ?? null,
    });
    setDialogOpen(true);
  };

  const submit = async () => {
    try {
      const payload: VolunteerPayload = { ...form };
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: payload });
      } else {
        await create.mutateAsync(payload);
      }
      setDialogOpen(false);
    } catch (e) {
      /* empty */
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t('volunteers.confirm_delete'))) return;
    try {
      await removeMutation.mutateAsync(id);
    } catch (e) {
      /* empty */
    }
  };

  if (isLoading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('volunteers.title')}</h1>
        <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 glass"
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="transition-glow hover:neon-glow-orange">
                <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.create')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-md">
              <DialogHeader>
                <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
                  {editing ? t('volunteers.edit') : t('volunteers.create')}
                </DialogTitle>
              </DialogHeader>
              <VolunteerForm initial={form} onChange={setForm} onSubmit={submit} submitting={create.isPending || update.isPending} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <VolunteerTable data={data?.data ?? data ?? []} onEdit={openEdit} onDelete={remove} />
    </div>
  );
};

export default Volunteers;
