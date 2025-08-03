import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ObservationsDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.observations')} {t('common.details')}</div>;
};

export default ObservationsDetails;
