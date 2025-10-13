import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Reusable login form component.
 * Shows validation errors and redirects to dashboard on success.
 */
export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // تم استخدام navigate هنا
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.trim().length >= 6; // Example of more complex password validation.
  const canSubmit = isEmailValid && isPasswordValid && !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await login(email, password); // استخدام login
      navigate('/dashboard'); // استخدام navigate هنا بعد تسجيل الدخول الناجح
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // التعامل مع الخطأ بشكل آمن
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      if (!isEmailValid) {
        document.getElementById('email')?.focus();
      } else if (!isPasswordValid) {
        document.getElementById('password')?.focus();
      }
    }
  }, [error, isEmailValid, isPasswordValid]);

  useEffect(() => {
    document.getElementById('email')?.focus();
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="glass-card p-8 space-y-4 w-full max-w-sm"
      aria-busy={loading}
    >
      <div className={`${loading ? 'animate-pulse' : 'opacity-0'} h-0.5 w-full rounded bg-gradient-to-r from-primary via-primary/60 to-primary`} />
      <h1 className="text-2xl font-bold text-center text-gradient-primary">
        {t('auth.login')}
      </h1>
      <p className="sr-only" aria-live="polite">
        {loading ? t('common.loading') : ''}
      </p>
      {error && <p className="text-destructive text-sm" role="alert">{error}</p>}

      <div>
        <label className="block mb-1" htmlFor="email">
          {t('auth.email')}
        </label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          aria-invalid={email.length > 0 && !isEmailValid}
          aria-describedby="email-help"
          className={`border ${email.length > 0 && !isEmailValid ? 'border-red-500' : 'border-primary'}`}
        />
        <span id="email-help" className="block mt-1 text-xs text-muted-foreground">
          {!isEmailValid && email.length > 0 ? t('auth.email_invalid') : '\u00A0'}
        </span>
      </div>

      <div>
        <label className="block mb-1" htmlFor="password">
          {t('auth.password')}
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        className={`w-full bg-gradient-primary text-white relative ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!canSubmit || loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('common.loading')}
          </span>
        ) : (
          t('auth.login')
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
