import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const GeoAreasForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.geoareas')}</div>;
};

export default GeoAreasForm;
