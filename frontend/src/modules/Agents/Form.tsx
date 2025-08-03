import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AgentsForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.agents')}</div>;
};

export default AgentsForm;
