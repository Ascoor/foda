import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Megaphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/infrastructure/shared/ui/dialog";
import { Button } from "@/infrastructure/shared/ui/button";
import { Input } from "@/infrastructure/shared/ui/input";
import { Label } from "@/infrastructure/shared/ui/label";
import { Textarea } from "@/infrastructure/shared/ui/textarea";
import { Campaign } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaign?: Campaign | null;
}

export const CampaignForm = ({
  isOpen,
  onClose,
  onSuccess,
  campaign,
}: Props) => {
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
            <Megaphone className="h-5 w-5" />
            {campaign ? t("common.edit") : t("campaigns.add_campaign")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t("campaigns.campaign_name")}</Label>
            <Input
              className="glass border-white/20"
              defaultValue={campaign?.name}
            />
          </div>
          <div>
            <Label>{t("campaigns.message")}</Label>
            <Textarea
              className="glass border-white/20"
              defaultValue={campaign?.message}
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 glass-button"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-primary text-white"
            >
              {isSubmitting ? "..." : t("common.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
