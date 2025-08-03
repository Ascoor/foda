import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.dashboard')} {t('common.details')}</div>;
};

export default DashboardDetails;
