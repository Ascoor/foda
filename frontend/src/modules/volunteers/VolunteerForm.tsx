import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Volunteer } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  volunteer?: Volunteer | null;
}

export const VolunteerForm = ({ isOpen, onClose, onSuccess, volunteer }: Props) => {
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
            {volunteer ? t('common.edit') : t('volunteers.add_volunteer')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t('volunteers.volunteer_name')}</Label>
            <Input className="glass border-white/20" defaultValue={volunteer?.name} />
          </div>
          <div>
            <Label>{t('volunteers.skills')}</Label>
            <Input className="glass border-white/20" defaultValue={volunteer?.role} />
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
