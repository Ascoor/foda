/**
 * Area management page.
 * Legacy reference: old/application/modules/area/views/area.php
 * Combines list, search, create, and edit flows.
 *
 * Testing:
 * 1. Navigate to /areas.
 * 2. Verify areas list, search, create, edit, and delete actions.
 */
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import AreaTable from '@/components/area/AreaTable';
import AreaForm from '@/components/area/AreaForm';
import { Area } from '@/lib/areas';

const AreaPage: React.FC = () => {
  const { language, direction, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Area | undefined>(undefined);

  const openCreate = () => {
    setEditing(undefined);
    setOpen(true);
  };

  const openEdit = (area: Area) => {
    setEditing(area);
    setOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${language === 'ar' ? 'font-arabic-heading' : ''}`}>{t('areas.title')}</h1>
        <Button onClick={openCreate} className="transition-glow hover:neon-glow-orange">
          <Plus className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          <span className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.create')}</span>
        </Button>
      </div>
      <AreaTable onEdit={openEdit} />
      <AreaForm open={open} onClose={() => setOpen(false)} initial={editing} />
    </div>
  );
};

export default AreaPage;
