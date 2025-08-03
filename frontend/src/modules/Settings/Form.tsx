import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const SettingsForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.settings')}</div>;
};

export default SettingsForm;
