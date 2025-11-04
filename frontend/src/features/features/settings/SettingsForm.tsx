import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchSettings, updateSettings } from "./api";
import { SystemSettings } from "./types";
import { Button } from "@/infrastructure/shared/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/infrastructure/shared/ui/select";
import { Input } from "@/infrastructure/shared/ui/input";
import { Switch } from "@/infrastructure/shared/ui/switch";
import { Label } from "@/infrastructure/shared/ui/label";
import { toast } from "@/infrastructure/shared/ui/sonner";

export const SettingsForm = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const [form, setForm] = useState<SystemSettings | null>(null);

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => toast.success(t("settings.save_success")),
    onError: () => toast.error(t("settings.save_error")),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      mutation.mutate(form);
    }
  };

  const handleReset = async () => {
    const res = await refetch();
    setForm(res.data ?? null);
  };

  if (isLoading || !form) {
    return <div>{t("common.loading")}</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-4 glass-card p-6"
      dir={direction}
    >
      <h1 className="text-2xl font-bold mb-4">{t("settings.title")}</h1>

      <div className="space-y-2">
        <Label htmlFor="language">{t("settings.language")}</Label>
        <Select
          value={form.language}
          onValueChange={(v) =>
            setForm((s) => ({ ...s!, language: v as "en" | "ar" }))
          }
        >
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">{t("settings.region")}</Label>
        <Input
          id="region"
          value={form.region}
          onChange={(e) => setForm((s) => ({ ...s!, region: e.target.value }))}
          className={`glass ${direction === "rtl" ? "text-right" : ""}`}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="allowRegistration"
          checked={form.allowRegistration}
          onCheckedChange={(checked) =>
            setForm((s) => ({ ...s!, allowRegistration: checked }))
          }
        />
        <Label htmlFor="allowRegistration">
          {t("settings.allow_registration")}
        </Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {t("common.save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={mutation.isPending}
        >
          {t("common.reset")}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
