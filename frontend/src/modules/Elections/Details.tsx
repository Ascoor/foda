import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ElectionDetails: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{t('elections.title')} {t('common.details')}</h1>
      {/* details content */}
    </div>
  );
};

export default ElectionDetails;
