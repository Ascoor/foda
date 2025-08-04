import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError(t('auth.login_error'));
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card p-8 space-y-4 w-full max-w-sm">
      <h1 className="text-2xl font-bold text-center text-gradient-primary">
        {t('auth.login')}
      </h1>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <div>
        <label className="block mb-1" htmlFor="email">
          {t('auth.email')}
        </label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        />
      </div>
      <Button type="submit" className="w-full bg-gradient-primary text-white">
        {t('auth.login')}
      </Button>
    </form>
  );
};

export default LoginForm;
