import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilePlus2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Observation } from './types';
import { mockCommittees } from './api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  observation?: Observation | null;
}

export const ObservationForm = ({ isOpen, onClose, onSuccess, observation }: Props) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <FilePlus2 className="h-5 w-5" />
            {observation ? t('common.edit') : t('observations.add_observation')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t('observations.observer')}</Label>
            <Input className="glass border-white/20" defaultValue={observation?.observer} />
          </div>
          <div>
            <Label>{t('observations.committee')}</Label>
            <Select defaultValue={observation?.committee_id || undefined}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder={t('observations.committee')} />
              </SelectTrigger>
              <SelectContent>
                {mockCommittees.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('observations.observation_type')}</Label>
            <Select defaultValue={observation?.type}>
              <SelectTrigger className="glass border-white/20">
                <SelectValue placeholder={t('observations.observation_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="violation">{t('observations.types.violation')}</SelectItem>
                <SelectItem value="note">{t('observations.types.note')}</SelectItem>
                <SelectItem value="complaint">{t('observations.types.complaint')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('observations.description')}</Label>
            <Textarea className="glass border-white/20" defaultValue={observation?.description} />
          </div>
          <div>
            <Label>{t('observations.evidence_image')}</Label>
            <Input type="file" className="glass border-white/20" />
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 glass-button">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-primary text-white">
              {isSubmitting ? '...' : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
