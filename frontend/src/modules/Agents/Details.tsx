import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AgentsDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.agents')} {t('common.details')}</div>;
};

export default AgentsDetails;
