import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CandidatesForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.candidates')}</div>;
};

export default CandidatesForm;
