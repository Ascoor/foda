import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AnalyticsForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.analytics')}</div>;
};

export default AnalyticsForm;
