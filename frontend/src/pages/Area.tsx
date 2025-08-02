import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchAreas, createArea, updateArea, deleteArea, AreaPayload } from '@/lib/areas';

interface Area {
  id: number;
  name: string;
  description: string;
  x?: string;
  y?: string;
}

const AreaPage: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState<AreaPayload>({ name: '', description: '', x: '', y: '' });

  const load = () => {
    setLoading(true);
    fetchAreas()
      .then((res) => setAreas(res.data ?? res))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', x: '', y: '' });
    setDialogOpen(true);
  };

  const openEdit = (area: Area) => {
    setEditing(area);
    setForm({ name: area.name, description: area.description, x: area.x || '', y: area.y || '' });
    setDialogOpen(true);
  };

  const submit = async () => {
    try {
      if (editing) {
        await updateArea(editing.id, form);
      } else {
        await createArea(form);
      }
      setDialogOpen(false);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t('areas.confirm_delete'))) return;
    try {
      await deleteArea(id);
      load();
    } catch (e: unknown) {
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
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('areas.title')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="transition-glow hover:neon-glow-orange">
              <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              <span className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.create')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
                {editing ? t('areas.edit') : t('areas.create')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.name')}</Label>
                <Input className="glass" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.description')}</Label>
                <Textarea className="glass" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className={`flex gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.x')}</Label>
                  <Input className="glass" value={form.x} onChange={(e) => setForm({ ...form, x: e.target.value })} />
                </div>
                <div className="flex-1">
                  <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.y')}</Label>
                  <Input className="glass" value={form.y} onChange={(e) => setForm({ ...form, y: e.target.value })} />
                </div>
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
            <TableHead>{t('areas.name')}</TableHead>
            <TableHead>{t('areas.description')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas.map((area) => (
            <TableRow key={area.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{area.name}</TableCell>
              <TableCell>{area.description}</TableCell>
              <TableCell>
                <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline" onClick={() => openEdit(area)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(area.id)}>
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

export default AreaPage;
