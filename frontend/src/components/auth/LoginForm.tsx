import { useState } from 'react';
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
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEmailValid = email.trim().length === 0
    ? false
    : /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const canSubmit = isEmailValid && password.trim().length > 0 && !loading;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError(t('auth.login_error'));
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (t('common.loading') || 'Loading...') : ''}
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
        />
        <span id="email-help" className="block mt-1 text-xs text-muted-foreground">
          {!isEmailValid && email.length > 0 ? t('auth.email_invalid') || 'Enter a valid email' : '\u00A0'}
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
        className="w-full bg-gradient-primary text-white relative"
        disabled={!canSubmit}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('common.loading') || 'Loading...'}
          </span>
        ) : (
          t('auth.login')
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
