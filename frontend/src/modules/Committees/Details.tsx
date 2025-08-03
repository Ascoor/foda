import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CommitteesDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.committees')} {t('common.details')}</div>;
};

export default CommitteesDetails;
