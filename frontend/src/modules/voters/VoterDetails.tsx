import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Voter } from './types';

interface VoterDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  voter: Voter | null;
  onEdit: (voter: Voter) => void;
}

export const VoterDetails = ({ isOpen, onClose, voter, onEdit }: VoterDetailsProps) => {
  const { t } = useTranslation();

  if (!voter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            Voter Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{voter.full_name}</h3>
            <p className="text-muted-foreground">{voter.national_id}</p>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={onClose} className="flex-1 glass-button">
              Close
            </Button>
            <Button onClick={() => onEdit(voter)} className="flex-1 bg-gradient-primary text-white">
              <Edit className="h-4 w-4 mr-2" />
              {t('common.edit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};