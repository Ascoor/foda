import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Candidate } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  candidate?: Candidate | null;
}

export const CandidateForm = ({ isOpen, onClose, onSuccess, candidate }: Props) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            {candidate ? t('common.edit') : t('candidates.add_candidate')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t('candidates.candidate_name')}</Label>
            <Input className="glass border-white/20" defaultValue={candidate?.name} />
          </div>
          <div>
            <Label>{t('candidates.party')}</Label>
            <Input className="glass border-white/20" defaultValue={candidate?.party} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('common.type')}</Label>
              <Select defaultValue={candidate?.type || 'individual'}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="individual">{t('candidates.types.individual')}</SelectItem>
                  <SelectItem value="list">{t('candidates.types.list')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('common.status')}</Label>
              <Select defaultValue={candidate?.status || 'active'}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
