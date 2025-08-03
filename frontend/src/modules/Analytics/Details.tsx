import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AnalyticsDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.analytics')} {t('common.details')}</div>;
};

export default AnalyticsDetails;
