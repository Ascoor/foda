import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const GeoAreasDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.geoareas')} {t('common.details')}</div>;
};

export default GeoAreasDetails;
