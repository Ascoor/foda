import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CommitteesForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.committees')}</div>;
};

export default CommitteesForm;
