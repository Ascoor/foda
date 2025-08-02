import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchSwots, createSwot, updateSwot, deleteSwot, fetchSwotReport, SwotPayload } from '@/lib/swots';

interface Swot {
  id: number;
  entity_type: string;
  entity_id: number;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

const SwotPage: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [swots, setSwots] = useState<Swot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Swot | null>(null);
  const [form, setForm] = useState<SwotPayload>({
    entity_type: 'area',
    entity_id: 0,
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
  });

  const [reportParams, setReportParams] = useState({ entity_type: 'area', entity_ids: '' });
  const [reportData, setReportData] = useState<Swot[]>([]);

  const load = () => {
    setLoading(true);
    fetchSwots()
      .then(res => setSwots(res.data ?? res))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ entity_type: 'area', entity_id: 0, strengths: '', weaknesses: '', opportunities: '', threats: '' });
    setDialogOpen(true);
  };

  const openEdit = (swot: Swot) => {
    setEditing(swot);
    setForm({
      entity_type: swot.entity_type,
      entity_id: swot.entity_id,
      strengths: swot.strengths,
      weaknesses: swot.weaknesses,
      opportunities: swot.opportunities,
      threats: swot.threats,
    });
    setDialogOpen(true);
  };

  const submit = async () => {
    try {
      if (editing) {
        await updateSwot(editing.id, form);
      } else {
        await createSwot(form);
      }
      setDialogOpen(false);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t('swots.confirm_delete'))) return;
    try {
      await deleteSwot(id);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const generateReport = async () => {
    try {
      const ids = reportParams.entity_ids
        .split(',')
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n));
      const res = await fetchSwotReport(reportParams.entity_type, ids);
      setReportData(res.data ?? res);
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
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('swots.title')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="transition-glow hover:neon-glow-orange">
              <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              <span className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.create')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
                {editing ? t('swots.edit') : t('swots.create')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.entity_type')}</Label>
                <Select value={form.entity_type} onValueChange={(v) => setForm({ ...form, entity_type: v })}>
                  <SelectTrigger className="glass w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area">{t('nav.areas')}</SelectItem>
                    <SelectItem value="team">{t('nav.teams')}</SelectItem>
                    <SelectItem value="volunteer">{t('dashboard.volunteers')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.entity_id')}</Label>
                <Input
                  type="number"
                  className="glass"
                  value={form.entity_id}
                  onChange={(e) => setForm({ ...form, entity_id: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.strengths')}</Label>
                <Textarea className="glass" value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.weaknesses')}</Label>
                <Textarea className="glass" value={form.weaknesses} onChange={(e) => setForm({ ...form, weaknesses: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.opportunities')}</Label>
                <Textarea className="glass" value={form.opportunities} onChange={(e) => setForm({ ...form, opportunities: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.threats')}</Label>
                <Textarea className="glass" value={form.threats} onChange={(e) => setForm({ ...form, threats: e.target.value })} />
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
            <TableHead>{t('swots.entity_type')}</TableHead>
            <TableHead>{t('swots.entity_id')}</TableHead>
            <TableHead>{t('swots.strengths')}</TableHead>
            <TableHead>{t('swots.weaknesses')}</TableHead>
            <TableHead>{t('swots.opportunities')}</TableHead>
            <TableHead>{t('swots.threats')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {swots.map((swot) => (
            <TableRow key={swot.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{swot.entity_type}</TableCell>
              <TableCell>{swot.entity_id}</TableCell>
              <TableCell>{swot.strengths}</TableCell>
              <TableCell>{swot.weaknesses}</TableCell>
              <TableCell>{swot.opportunities}</TableCell>
              <TableCell>{swot.threats}</TableCell>
              <TableCell>
                <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline" onClick={() => openEdit(swot)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(swot.id)}>
                    {t('common.delete')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="space-y-4">
        <h2 className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('swots.report')}</h2>
        <div className={`flex gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div>
            <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.entity_type')}</Label>
            <Select value={reportParams.entity_type} onValueChange={(v) => setReportParams({ ...reportParams, entity_type: v })}>
              <SelectTrigger className="w-48 glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">{t('nav.areas')}</SelectItem>
                <SelectItem value="team">{t('nav.teams')}</SelectItem>
                <SelectItem value="volunteer">{t('dashboard.volunteers')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.entity_ids')}</Label>
            <Input
              className="glass"
              value={reportParams.entity_ids}
              onChange={(e) => setReportParams({ ...reportParams, entity_ids: e.target.value })}
              placeholder="1,2,3"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={generateReport} className="transition-glow hover:neon-glow-orange">
              <span className={language === 'ar' ? 'font-arabic' : ''}>{t('swots.generate_report')}</span>
            </Button>
          </div>
        </div>
        {reportData.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
                <TableHead>{t('swots.entity_id')}</TableHead>
                <TableHead>{t('swots.strengths')}</TableHead>
                <TableHead>{t('swots.weaknesses')}</TableHead>
                <TableHead>{t('swots.opportunities')}</TableHead>
                <TableHead>{t('swots.threats')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((r) => (
                <TableRow key={r.id} className={direction === 'rtl' ? 'text-right' : ''}>
                  <TableCell>{r.entity_id}</TableCell>
                  <TableCell>{r.strengths}</TableCell>
                  <TableCell>{r.weaknesses}</TableCell>
                  <TableCell>{r.opportunities}</TableCell>
                  <TableCell>{r.threats}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default SwotPage;
