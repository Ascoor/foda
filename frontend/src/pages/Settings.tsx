import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSettings, updateSettings, Setting } from '@/lib/settings';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FieldConfig {
  key: string;
  label: string;
  type: 'string' | 'integer' | 'boolean';
}

const SETTINGS_SCHEMA: { category: string; fields: FieldConfig[] }[] = [
  {
    category: 'General',
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'string' },
      { key: 'site_email', label: 'Contact Email', type: 'string' },
      { key: 'default_language', label: 'Default Language', type: 'string' },
    ],
  },
  {
    category: 'Notifications',
    fields: [
      { key: 'enable_notifications', label: 'Enable Notifications', type: 'boolean' },
    ],
  },
  {
    category: 'Integrations',
    fields: [
      { key: 'analytics_id', label: 'Analytics ID', type: 'string' },
    ],
  },
];

const SettingsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Setting[]>({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });

const [form, setForm] = useState<Record<string, unknown>>({});
const [initial, setInitial] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (data) {
      const values: Record<string, unknown> = {};
      data.forEach((s) => {
        values[s.key] = s.value;
      });
      setForm(values);
      setInitial(values);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const handleChange = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const payload: Record<string, unknown> = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== initial[key]) {
        payload[key] = form[key];
      }
    });
    mutation.mutate(payload);
  };

  if (isLoading) {
    return <div className="p-6">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{(error as Error).message}</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('settings.title')}</h1>
      {SETTINGS_SCHEMA.map((section) => (
        <div key={section.category} className="space-y-4">
          <h2 className="text-xl font-semibold">{section.category}</h2>
          {section.fields.map((field) => (
            <div key={field.key} className="flex items-center gap-4">
              <Label className="w-48" htmlFor={field.key}>
                {field.label}
              </Label>
              {field.type === 'boolean' ? (
                <Switch
                  id={field.key}
                  checked={Boolean(form[field.key])}
                  onCheckedChange={(checked) => handleChange(field.key, checked)}
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type === 'integer' ? 'number' : 'text'}
                  className="glass w-80"
                  value={form[field.key] ?? ''}
                  onChange={(e) =>
                    handleChange(
                      field.key,
                      field.type === 'integer' ? Number(e.target.value) : e.target.value
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <Button
        onClick={handleSubmit}
        disabled={mutation.isLoading}
        className="transition-glow hover:neon-glow-orange"
      >
        {t('common.save')}
      </Button>
      {mutation.isSuccess && <p className="text-green-500">{t('common.saved')}</p>}
      {mutation.isError && <p className="text-red-500">{t('common.error')}</p>}
    </div>
  );
};

export default SettingsPage;
