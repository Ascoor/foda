import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const VolunteersForm: React.FC = () => {
  const { t } = useLanguage();
  return <div className="p-4">{t('common.add')} {t('nav.volunteers')}</div>;
};

export default VolunteersForm;
