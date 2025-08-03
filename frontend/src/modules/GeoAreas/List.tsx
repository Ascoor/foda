import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const GeoAreasList: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{t('nav.geoareas')}</h1>
    </div>
  );
};

export default GeoAreasList;
