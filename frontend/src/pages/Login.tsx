import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

// صفحة تسجيل الدخول البسيطة
export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(t('auth.login_error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={onSubmit} className="glass-card p-8 space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gradient-primary">
          {t('auth.login')}
        </h1>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <div>
          <label className="block mb-1" htmlFor="username">
            {t('auth.username')}
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
    </div>
  );
};

export default Login;
