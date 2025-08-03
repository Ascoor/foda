/**
 * Area form modal for create & edit.
 * Legacy reference: old/application/modules/area/views/add_new.php
 * and modal forms in views/area.php.
 *
 * Testing:
 * 1. Navigate to /areas.
 * 2. Click "Add" button -> form appears.
 * 3. Submit with valid/invalid data to observe API response.
 */
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Area, AreaPayload } from '@/lib/areas';
import { useCreateArea, useUpdateArea } from '@/hooks/useAreas';

interface AreaFormProps {
  open: boolean;
  onClose: () => void;
  initial?: Area;
}

const AreaForm: React.FC<AreaFormProps> = ({ open, onClose, initial }) => {
  const { language, direction, t } = useLanguage();
  const [form, setForm] = useState<AreaPayload>({ name: '', description: '', x: '', y: '' });
  const createArea = useCreateArea();
  const updateArea = useUpdateArea();
  const isEdit = Boolean(initial);

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name, description: initial.description, x: initial.x || '', y: initial.y || '' });
    } else {
      setForm({ name: '', description: '', x: '', y: '' });
    }
  }, [initial]);

  const submit = async () => {
    if (isEdit && initial) {
      await updateArea.mutateAsync({ id: initial.id, payload: form });
    } else {
      await createArea.mutateAsync(form);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass max-w-md">
        <DialogHeader>
          <DialogTitle className={language === 'ar' ? 'font-arabic-heading' : ''}>
            {isEdit ? t('areas.edit') : t('areas.create')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.name')}</Label>
            <Input className="glass" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.description')}</Label>
            <Textarea className="glass" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className={`flex gap-4 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.x')}</Label>
              <Input className="glass" value={form.x} onChange={(e) => setForm({ ...form, x: e.target.value })} />
            </div>
            <div className="flex-1">
              <Label className={language === 'ar' ? 'font-arabic' : ''}>{t('areas.y')}</Label>
              <Input className="glass" value={form.y} onChange={(e) => setForm({ ...form, y: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <span className={language === 'ar' ? 'font-arabic' : ''}>{t('common.cancel')}</span>
          </Button>
          <Button onClick={submit} className="transition-glow hover:neon-glow-orange">
            <span className={language === 'ar' ? 'font-arabic' : ''}>{t('common.save')}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AreaForm;
