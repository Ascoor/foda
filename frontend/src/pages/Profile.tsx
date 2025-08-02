import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';

const Profile = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      setForm((f) => ({ ...f, name: data.data.name, email: data.data.email }));
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(form);
    setMessage(t('common.success'));
    setForm({ ...form, password: '', password_confirmation: '' });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">{t('profile.title')}</h1>
      {message && <p className="text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t('auth.name')}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t('auth.email')}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder={t('auth.password')}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          placeholder={t('profile.password_confirmation')}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-primary text-primary-foreground rounded"
        >
          {t('profile.update')}
        </button>
      </form>
    </div>
  );
};

export default Profile;
