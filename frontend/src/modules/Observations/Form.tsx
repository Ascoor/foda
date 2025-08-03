import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ObservationsForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.observations')}</div>;
};

export default ObservationsForm;
