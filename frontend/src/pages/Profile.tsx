import { useEffect, useState } from 'react';
import { fetchProfile, updateProfile, uploadAvatar, changePassword } from '@/lib/profile';
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
      const data = await fetchProfile();
      setForm((f) => ({ ...f, name: data.data.name, email: data.data.email }));
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, password_confirmation } = form;
    await updateProfile({ name, email });
    if (password) {
      await changePassword({ password, password_confirmation });
    }
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
        <input
          type="file"
          onChange={async (e) => {
            if (e.target.files?.[0]) {
              await uploadAvatar(e.target.files[0]);
              setMessage(t('common.success'));
            }
          }}
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
