import { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/infrastructure/shared/ui/dialog";
import { Button } from "@/infrastructure/shared/ui/button";
import { Input } from "@/infrastructure/shared/ui/input";
import { Label } from "@/infrastructure/shared/ui/label";
import { Agent } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  agent?: Agent | null;
}

export const AgentForm = ({ isOpen, onClose, onSuccess, agent }: Props) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            {agent ? t("common.edit") : t("agents.add_agent")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t("agents.agent_name")}</Label>
            <Input
              className="glass border-white/20"
              defaultValue={agent?.name}
            />
          </div>
          <div>
            <Label>{t("agents.mobile")}</Label>
            <Input
              className="glass border-white/20"
              defaultValue={agent?.mobile}
            />
          </div>
          <div>
            <Label>{t("agents.role")}</Label>
            <Input
              className="glass border-white/20"
              defaultValue={agent?.role}
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
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("common.save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
