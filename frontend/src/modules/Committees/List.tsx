import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CommitteesList: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{t('nav.committees')}</h1>
    </div>
  );
};

export default CommitteesList;
