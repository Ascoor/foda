import { useLanguage } from '@/contexts/LanguageContext';

const FooterPage = () => {
  const { t } = useLanguage();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{t('home.footer')}</h1>
      <p>{t('home.footer_placeholder') || 'Application footer placeholder.'}</p>
    </div>
  );
};

export default FooterPage;
