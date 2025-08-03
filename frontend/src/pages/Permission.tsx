import { useLanguage } from '@/contexts/LanguageContext';

const Permission = () => {
  const { t } = useLanguage();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{t('home.permission')}</h1>
      <p>{t('home.permission_placeholder') || 'Permission management placeholder.'}</p>
    </div>
  );
};

export default Permission;
