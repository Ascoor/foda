import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchSms, sendSms, deleteSms, SmsPayload } from '@/lib/sms';

interface Sms {
  id: number;
  message: string;
  recipient: string;
  status: string;
  sent_at?: string;
  scheduled_for?: string;
}

const SmsPage: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [messages, setMessages] = useState<Sms[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<SmsPayload>({ message: '', recipient: '' });

  const load = () => {
    setLoading(true);
    fetchSms()
      .then((res) => setMessages(res.data ?? res))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm({ message: '', recipient: '' });
    setDialogOpen(true);
  };

  const submit = async () => {
    try {
      await sendSms(form);
      setDialogOpen(false);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t('sms.confirm_delete'))) return;
    try {
      await deleteSms(id);
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
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('sms.title')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="transition-glow hover:neon-glow-orange">
              <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              <span className={language === 'ar' ? 'font-arabic' : ''}>{t('sms.send')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>{t('sms.send')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className={language === 'ar' ? 'font-arabic' : ''}>{t('sms.recipient')}</label>
                <Input className="glass" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} />
              </div>
              <div>
                <label className={language === 'ar' ? 'font-arabic' : ''}>{t('sms.message')}</label>
                <Textarea className="glass" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <span className={language === 'ar' ? 'font-arabic' : ''}>{t('common.cancel')}</span>
              </Button>
              <Button onClick={submit} className="transition-glow hover:neon-glow-orange">
                <span className={language === 'ar' ? 'font-arabic' : ''}>{t('sms.send')}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow className={direction === 'rtl' ? 'text-right' : ''}>
            <TableHead>{t('sms.recipient')}</TableHead>
            <TableHead>{t('sms.message')}</TableHead>
            <TableHead>{t('sms.status')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((m) => (
            <TableRow key={m.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{m.recipient}</TableCell>
              <TableCell>{m.message}</TableCell>
              <TableCell>{m.status}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="destructive" onClick={() => remove(m.id)}>
                  {t('common.delete')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SmsPage;
