import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchSettings, createSetting, updateSetting, deleteSetting, SettingPayload } from '@/lib/settings';

interface Setting extends SettingPayload {
  id: number;
}

const SettingsPage: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Setting | null>(null);
  const [form, setForm] = useState<SettingPayload>({ key: '', value: '', type: 'string', description: '' });

  const load = () => {
    setLoading(true);
    fetchSettings()
      .then((res) => setSettings(res.data ?? res))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ key: '', value: '', type: 'string', description: '' });
    setDialogOpen(true);
  };

  const openEdit = (setting: Setting) => {
    setEditing(setting);
    setForm({ key: setting.key, value: String(setting.value), type: setting.type, description: setting.description });
    setDialogOpen(true);
  };

  const submit = async () => {
    if (!form.key || !form.value || !form.type) {
      setError(t('common.error'));
      return;
    }
    try {
      if (editing) {
        await updateSetting(editing.id, form);
      } else {
        await createSetting(form);
      }
      setDialogOpen(false);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t('settings.confirm_delete'))) return;
    try {
      await deleteSetting(id);
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
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('settings.title')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="transition-glow hover:neon-glow-orange">
              <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              <span className={language === 'ar' ? 'font-arabic' : ''}>{t('settings.create')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
                {editing ? t('settings.edit') : t('settings.create')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('settings.key')}</Label>
                <Input className="glass" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('settings.value')}</Label>
                <Input className="glass" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('settings.type')}</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as SettingPayload['type'] })}>
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="integer">integer</SelectItem>
                    <SelectItem value="boolean">boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('settings.description')}</Label>
                <Input className="glass" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
            <TableHead>{t('settings.key')}</TableHead>
            <TableHead>{t('settings.value')}</TableHead>
            <TableHead>{t('settings.type')}</TableHead>
            <TableHead>{t('settings.description')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.id} className={direction === 'rtl' ? 'text-right' : ''}>
              <TableCell>{setting.key}</TableCell>
              <TableCell>{String(setting.value)}</TableCell>
              <TableCell>{setting.type}</TableCell>
              <TableCell>{setting.description}</TableCell>
              <TableCell>
                <div className={`flex gap-2 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Button size="sm" variant="outline" onClick={() => openEdit(setting)}>
                    {t('common.edit')}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(setting.id)}>
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

export default SettingsPage;
