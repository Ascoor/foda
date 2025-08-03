import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CampaignsForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.campaigns')}</div>;
};

export default CampaignsForm;
