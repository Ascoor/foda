import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const SettingsDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.settings')} {t('common.details')}</div>;
};

export default SettingsDetails;
