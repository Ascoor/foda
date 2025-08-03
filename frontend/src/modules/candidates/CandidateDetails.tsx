import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Candidate } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onEdit: (candidate: Candidate) => void;
}

export const CandidateDetails = ({ isOpen, onClose, candidate, onEdit }: Props) => {
  const { t } = useTranslation();
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('candidates.candidate_name')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{candidate.name}</h3>
            <p className="text-muted-foreground">{candidate.party}</p>
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={onClose} className="flex-1 glass-button">
              {t('common.cancel')}
            </Button>
            <Button onClick={() => onEdit(candidate)} className="flex-1 bg-gradient-primary text-white">
              {t('common.edit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
