import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSettings, updateSettings } from './api';
import { SystemSettings } from './types';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const Settings = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<SystemSettings | null>(null);

  useEffect(() => {
    fetchSettings().then(setForm);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      await updateSettings(form);
    }
  };

  if (!form) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 glass-card p-6">
      <h1 className="text-2xl font-bold mb-4">{t('settings.title')}</h1>

      <div className="space-y-2">
        <Label htmlFor="language">{t('settings.language')}</Label>
        <Select
          value={form.language}
          onValueChange={v => setForm(s => ({ ...s!, language: v as 'en' | 'ar' }))}
        >
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">{t('settings.region')}</Label>
        <Input
          id="region"
          value={form.region}
          onChange={e => setForm(s => ({ ...s!, region: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="allowRegistration"
          checked={form.allowRegistration}
          onCheckedChange={checked =>
            setForm(s => ({ ...s!, allowRegistration: checked }))
          }
        />
        <Label htmlFor="allowRegistration">
          {t('settings.allow_registration')}
        </Label>
      </div>

      <Button type="submit">{t('common.save')}</Button>
    </form>
  );
};
