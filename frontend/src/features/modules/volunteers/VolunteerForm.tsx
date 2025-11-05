import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/infrastructure/shared/ui/select";
import type { Volunteer } from "./types";
import type { VolunteerFormData } from "./types";
import { createVolunteer, updateVolunteer } from "./api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  volunteer?: Volunteer | null;
}

const defaultForm: VolunteerFormData = {
  full_name: "",
  email: "",
  phone: "",
  status: "active",
  assigned_committee_uuid: null,
  notes: "",
};

export const VolunteerForm = ({
  isOpen,
  onClose,
  onSuccess,
  volunteer,
}: Props) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<VolunteerFormData>(defaultForm);

  useEffect(() => {
    if (volunteer) {
      setForm({
        full_name: volunteer.full_name,
        email: volunteer.email ?? "",
        phone: volunteer.phone ?? "",
        status: volunteer.status,
        assigned_committee_uuid: volunteer.assigned_committee_uuid ?? null,
        notes: volunteer.notes ?? "",
        election_uuid: volunteer.election_uuid,
        skills: volunteer.skills,
        availability: volunteer.availability,
      });
    } else {
      setForm(defaultForm);
    }
  }, [volunteer]);

  const handleChange = (field: keyof VolunteerFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (volunteer) {
        await updateVolunteer(volunteer.uuid, form);
      } else {
        await createVolunteer(form);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save volunteer", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            {volunteer ? t("common.edit") : t("volunteers.add_volunteer")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t("volunteers.volunteer_name")}</Label>
            <Input
              className="glass border-white/20"
              value={form.full_name}
              onChange={(event) =>
                handleChange("full_name", event.target.value)
              }
              required
            />
          </div>
          <div>
            <Label>{t("common.email", { defaultValue: "Email" })}</Label>
            <Input
              type="email"
              className="glass border-white/20"
              value={form.email ?? ""}
              onChange={(event) => handleChange("email", event.target.value)}
            />
          </div>
          <div>
            <Label>{t("common.phone", { defaultValue: "Phone" })}</Label>
            <Input
              className="glass border-white/20"
              value={form.phone ?? ""}
              onChange={(event) => handleChange("phone", event.target.value)}
            />
          </div>
          <div>
            <Label>
              {t("volunteers.status_filter", { defaultValue: "Status" })}
            </Label>
            <Select
              value={form.status ?? "active"}
              onValueChange={(value) =>
                handleChange("status", value as Volunteer["status"])
              }
            >
              <SelectTrigger className="glass border-white/20">
                <SelectValue
                  placeholder={t("volunteers.status_filter", {
                    defaultValue: "Status",
                  })}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  {t("status.active", { defaultValue: "Active" })}
                </SelectItem>
                <SelectItem value="onboarding">
                  {t("status.onboarding", { defaultValue: "Onboarding" })}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("status.inactive", { defaultValue: "Inactive" })}
                </SelectItem>
              </SelectContent>
            </Select>
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
