import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const ElectionForm: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{t('elections.add')}</h1>
      {/* form fields would go here */}
    </div>
  );
};

export default ElectionForm;
