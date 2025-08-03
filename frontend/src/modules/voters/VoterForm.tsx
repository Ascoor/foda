import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Voter } from './types';

interface VoterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  voter?: Voter | null;
}

export const VoterForm = ({ isOpen, onClose, onSuccess, voter }: VoterFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            {voter ? t('common.edit') : t('voters.add_voter')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t('voters.full_name')}</Label>
            <Input className="glass border-white/20" defaultValue={voter?.full_name} />
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 glass-button">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-primary text-white">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};