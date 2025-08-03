import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const VotersDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.voters')} {t('common.details')}</div>;
};

export default VotersDetails;
