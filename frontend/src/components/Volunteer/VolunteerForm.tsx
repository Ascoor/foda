/**
 * Form for creating/updating volunteers.
 * Legacy reference: old/application/modules/volunteer/views/add_new.php
 * Test: mount inside dialog, submit with valid/invalid data.
 */
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { VolunteerPayload } from '@/lib/volunteers';

type Props = {
  initial: VolunteerPayload;
  onChange: (data: VolunteerPayload) => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export const VolunteerForm: React.FC<Props> = ({ initial, onChange, onSubmit, submitting }) => {
  const { t, language } = useLanguage();
  return (
    <div className="space-y-4">
      <div>
        <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.name')}</Label>
        <Input value={initial.name} onChange={e => onChange({ ...initial, name: e.target.value })} className="glass" />
      </div>
      <div>
        <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.email')}</Label>
        <Input value={initial.email} onChange={e => onChange({ ...initial, email: e.target.value })} className="glass" />
      </div>
      <div>
        <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.phone')}</Label>
        <Input value={initial.phone} onChange={e => onChange({ ...initial, phone: e.target.value })} className="glass" />
      </div>
      <div>
        <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('volunteers.team')}</Label>
        <Input
          value={initial.team_id ?? ''}
          onChange={e => onChange({ ...initial, team_id: e.target.value ? Number(e.target.value) : null })}
          className="glass"
        />
      </div>
      <Button onClick={onSubmit} disabled={submitting} className="transition-glow hover:neon-glow-orange">
        {t('common.save')}
      </Button>
    </div>
  );
};
