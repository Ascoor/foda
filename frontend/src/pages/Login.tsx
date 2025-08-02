import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(2);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = isRegister
        ? await register(name, email, password, roleId)
        : await login(email, password);
      const roles: string[] = data.data.user.roles.map(
        (r: { name: string }) => r.name
      );
      if (roles.includes('admin')) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch {
      setError(t('common.error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">
          {isRegister ? t('auth.register') : t('auth.login')}
        </h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {isRegister && (
          <input
            type="text"
            placeholder={t('auth.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}
        <input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {isRegister && (
          <input
            type="number"
            placeholder={t('auth.role')}
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        )}
        <button
          type="submit"
          className="w-full py-2 bg-primary text-primary-foreground rounded"
        >
          {isRegister ? t('auth.register') : t('auth.login')}
        </button>
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-center w-full underline"
        >
          {isRegister ? t('auth.have_account') : t('auth.no_account')}
        </button>
      </form>
    </div>
  );
};

export default Login;
