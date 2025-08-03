import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CampaignsDetails: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('nav.campaigns')} {t('common.details')}</div>;
};

export default CampaignsDetails;
