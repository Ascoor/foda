import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const VolunteersDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.volunteers')} {t('common.details')}</div>;
};

export default VolunteersDetails;
