import React, { useEffect, useState, useRef } from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { importVoters, exportVoters, VoterPayload } from '@/lib/voters';
import { fetchAreas } from '@/lib/areas';
import { useVoters } from '@/hooks/useVoters';

interface Area {
  id: number;
  name: string;
}

interface Voter {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  voter_id: string;
  area?: Area;
  address?: string;
  sex?: string;
  birthdate?: string;
}

const VotersPage: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [areas, setAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState({ name: '', voter_id: '' });
  const voterQuery = useVoters(search);
  const { data, isLoading, error, create, update, remove: removeMutation } = voterQuery;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Voter | null>(null);
  const [form, setForm] = useState<VoterPayload>({ name: '', email: '', phone: '', area_id: '', address: '', sex: '', birthdate: '', voter_id: '' });
  const fileRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    fetchAreas().then((res) => setAreas(res.data ?? res));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', area_id: '', address: '', sex: '', birthdate: '', voter_id: '' });
    setDialogOpen(true);
  };

  const openEdit = (voter: Voter) => {
    setEditing(voter);
    setForm({
      name: voter.name,
      email: voter.email || '',
      phone: voter.phone || '',
      area_id: voter.area ? String(voter.area.id) : '',
      address: voter.address || '',
      sex: voter.sex || '',
      birthdate: voter.birthdate || '',
      voter_id: voter.voter_id,
    });
    setDialogOpen(true);
  };

  const submit = async () => {
    if (!form.name || !form.area_id || !form.voter_id) {
      setLocalError(t('common.error'));
      return;
    }
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: form });
      } else {
        await create.mutateAsync(form);
      }
      setDialogOpen(false);
    } catch (e: unknown) {
      /* empty */
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t('voters.confirm_delete'))) return;
    try {
      await removeMutation.mutateAsync(id);
    } catch (e: unknown) {
      /* empty */
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importVoters(file);
      // refresh list
      voterQuery.refetch();
    } catch (e: unknown) {
      /* empty */
    } finally {
      e.target.value = '';
    }
  };

  const handleExport = () => {
    exportVoters().catch((e: unknown) => setLocalError((e as Error).message));
  };

  if (isLoading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (error || localError) {
    return <div className="p-6 text-red-500">{(error as Error)?.message || localError}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('voters.title')}</h1>
        <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Button onClick={handleExport} className="transition-glow hover:neon-glow-orange">
            <Download className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            <span className={language === 'ar' ? 'font-arabic' : ''}>{t('voters.export')}</span>
          </Button>
          <Button onClick={() => fileRef.current?.click()} className="transition-glow hover:neon-glow-orange">
            <Upload className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            <span className={language === 'ar' ? 'font-arabic' : ''}>{t('voters.import')}</span>
          </Button>
          <input type="file" ref={fileRef} className="hidden" onChange={handleImport} />
          <Input
            placeholder={t('common.search')}
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            className="w-48 glass"
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate} className="transition-glow hover:neon-glow-orange">
                <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                <span className={language === 'ar' ? 'font-arabic' : ''}>{t('voters.create')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-md">
              <DialogHeader>
                <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
                  {editing ? t('voters.edit') : t('voters.create')}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('voters.name')}</Label>
                  <Input className="glass" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('voters.email')}</Label>
                  <Input className="glass" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('voters.phone')}</Label>
                  <Input className="glass" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('voters.area')}</Label>
                  <Select value={String(form.area_id)} onValueChange={(v) => setForm({ ...form, area_id: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('voters.area')} />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('voters.voter_id')}</Label>
                  <Input className="glass" value={form.voter_id} onChange={(e) => setForm({ ...form, voter_id: e.target.value })} />
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
      </div>

      <Table>
        <TableHeader>
          <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
            <TableHead>{t('voters.name')}</TableHead>
            <TableHead>{t('voters.voter_id')}</TableHead>
            <TableHead>{t('voters.area')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data?.data ?? data ?? []).map((v: Voter) => (
            <TableRow key={v.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.voter_id}</TableCell>
              <TableCell>{v.area?.name}</TableCell>
              <TableCell>
                <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline" onClick={() => openEdit(v)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(v.id)}>
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

export default VotersPage;
