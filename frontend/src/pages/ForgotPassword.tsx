import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ForgotPassword = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const mutation = useMutation({
    mutationFn: () => requestPasswordReset(email),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">{t('auth.forgot_password')}</h1>
        {mutation.isSuccess && (
          <p className="text-green-500 text-sm text-center">{t('auth.email_sent')}</p>
        )}
        {mutation.isError && (
          <p className="text-red-500 text-sm text-center">{(mutation.error as Error).message}</p>
        )}
        <Input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={mutation.isLoading}>
          {t('auth.send_reset_link')}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
