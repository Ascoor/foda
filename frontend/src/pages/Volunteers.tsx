import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchVolunteers, createVolunteer, updateVolunteer, deleteVolunteer, VolunteerPayload } from '@/lib/volunteers';

interface Volunteer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  team?: { id: number | null; name: string | null };
}

const Volunteers: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState<VolunteerPayload>({ name: '', email: '', phone: '', team_id: null });

  const load = () => {
    setLoading(true);
    fetchVolunteers()
      .then((res) => setVolunteers(res.data ?? res))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

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
        await updateVolunteer(editing.id, payload);
      } else {
        await createVolunteer(payload);
      }
      setDialogOpen(false);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t('volunteers.confirm_delete'))) return;
    try {
      await deleteVolunteer(id);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (loading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('volunteers.title')}</h1>
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
            <div className="space-y-4">
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.name')}</Label>
                <Input className="glass" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.email')}</Label>
                <Input className="glass" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.phone')}</Label>
                <Input className="glass" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.team')}</Label>
                <Input
                  className="glass"
                  value={form.team_id ?? ''}
                  onChange={(e) => setForm({ ...form, team_id: e.target.value ? Number(e.target.value) : null })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <span className={language === 'ar' ? 'font-arabic' : ''}>{t('common.cancel')}</span>
              </Button>
              <Button onClick={submit} className="transition-glow hover:neon-glow-orange">
                <span className={language === 'ar' ? 'font-arabic' : ''}>{t('common.save')}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
            <TableHead>{t('volunteers.name')}</TableHead>
            <TableHead>{t('volunteers.email')}</TableHead>
            <TableHead>{t('volunteers.phone')}</TableHead>
            <TableHead>{t('volunteers.team')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteers.map((vol) => (
            <TableRow key={vol.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{vol.name}</TableCell>
              <TableCell>{vol.email}</TableCell>
              <TableCell>{vol.phone}</TableCell>
              <TableCell>{vol.team?.name}</TableCell>
              <TableCell>
                <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline" onClick={() => openEdit(vol)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(vol.id)}>
                    {t('common.delete')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Volunteers;
