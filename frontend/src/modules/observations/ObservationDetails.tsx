import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Observation } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  observation: Observation | null;
  onEdit: (obs: Observation) => void;
}

export const ObservationDetails = ({ isOpen, onClose, observation, onEdit }: Props) => {
  const { t } = useTranslation();
  if (!observation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {t('observations.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p><strong>{t('observations.observer')}:</strong> {observation.observer}</p>
          {observation.committee_name && (
            <p><strong>{t('observations.committee')}:</strong> {observation.committee_name}</p>
          )}
          <p><strong>{t('observations.observation_type')}:</strong> {t(`observations.types.${observation.type}`)}</p>
          <p><strong>{t('observations.description')}:</strong> {observation.description}</p>
          {observation.image_url && (
            <img src={observation.image_url} alt="evidence" className="w-full rounded" />
          )}
          <p className="text-sm text-muted-foreground">{new Date(observation.timestamp).toLocaleString()}</p>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={onClose} className="flex-1 glass-button">
              {t('common.cancel')}
            </Button>
            <Button onClick={() => onEdit(observation)} className="flex-1 bg-gradient-primary text-white">
              {t('common.edit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
