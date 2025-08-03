import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.dashboard')}</div>;
};

export default DashboardForm;
