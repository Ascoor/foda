import { useTranslation } from 'react-i18next';
import { Megaphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Campaign } from './types';
import { sendCampaign } from './api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  onEdit: (c: Campaign) => void;
}

export const CampaignDetails = ({ isOpen, onClose, campaign, onEdit }: Props) => {
  const { t } = useTranslation();
  if (!campaign) return null;

  const handleSend = async () => {
    await sendCampaign(campaign.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            {campaign.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p>{campaign.message}</p>
          <p><strong>{t('campaigns.sent')}:</strong> {campaign.sent}</p>
          <p><strong>{t('campaigns.delivered')}:</strong> {campaign.delivered}</p>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={onClose} className="flex-1 glass-button">
              {t('common.cancel')}
            </Button>
            <Button onClick={() => onEdit(campaign)} className="flex-1 bg-gradient-primary text-white">
              {t('common.edit')}
            </Button>
            <Button onClick={handleSend} className="flex-1 bg-gradient-primary text-white">
              {t('campaigns.send')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
