import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchSmsSettings, updateSmsSettings, SmsSettingsPayload } from '@/lib/sms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SmsSettings: React.FC = () => {
  const { t } = useLanguage();
  const { data } = useQuery({ queryKey: ['sms-settings'], queryFn: fetchSmsSettings });
  const [form, setForm] = useState<SmsSettingsPayload>({ api_key: '', sender_id: '' });

  useEffect(() => {
    if (data) {
      setForm(data.data ?? data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => updateSmsSettings(form),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="p-6 space-y-4 max-w-md">
      <h1 className="text-3xl font-bold">{t('sms.settings')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>{t('sms.api_key') || 'API Key'}</label>
          <Input
            value={form.api_key}
            onChange={(e) => setForm({ ...form, api_key: e.target.value })}
          />
        </div>
        <div>
          <label>{t('sms.sender_id') || 'Sender ID'}</label>
          <Input
            value={form.sender_id}
            onChange={(e) => setForm({ ...form, sender_id: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={mutation.isLoading}>
          {t('common.save')}
        </Button>
      </form>
      {mutation.isError && (
        <p className="text-red-500 text-sm">{(mutation.error as Error).message}</p>
      )}
      {mutation.isSuccess && (
        <p className="text-green-500 text-sm">{t('common.saved')}</p>
      )}
    </div>
  );
};

export default SmsSettings;
