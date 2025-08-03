import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CandidatesDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.candidates')} {t('common.details')}</div>;
};

export default CandidatesDetails;
