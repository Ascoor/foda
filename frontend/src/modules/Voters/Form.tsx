import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const VotersForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.voters')}</div>;
};

export default VotersForm;
