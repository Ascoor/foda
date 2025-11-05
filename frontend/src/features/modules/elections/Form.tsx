import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { ElectionFormData } from "./types";
import { Input } from "@/infrastructure/shared/ui/input";
import { Button } from "@/infrastructure/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/infrastructure/shared/ui/select";

const schema = z.object({
  name: z.string().min(1),
  type: z.enum(["presidential", "parliamentary", "local", "referendum"]),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  description: z.string().optional(),
});

interface Props {
  defaultValues?: ElectionFormData;
  onSubmit: (data: ElectionFormData) => void;
  onCancel?: () => void;
}

export const ElectionForm = ({ defaultValues, onSubmit, onCancel }: Props) => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const form = useForm<ElectionFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Input
          placeholder={t("elections.election_name")}
          {...form.register("name")}
          className="glass"
        />
        {form.formState.errors.name && (
          <p className="text-destructive text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Select
          defaultValue={form.watch("type")}
          onValueChange={(val) =>
            form.setValue("type", val as ElectionFormData["type"])
          }
        >
          <SelectTrigger className="glass">
            <SelectValue placeholder={t("elections.election_type")} />
          </SelectTrigger>
          <SelectContent>
            {(
              ["presidential", "parliamentary", "local", "referendum"] as const
            ).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {t(`elections.types.${opt}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.type && (
          <p className="text-destructive text-sm">
            {form.formState.errors.type.message}
          </p>
        )}
      </div>

      <div>
        <Input
          type="date"
          placeholder={t("elections.start_date")}
          {...form.register("start_date")}
          className={`glass ${direction === "rtl" ? "text-right" : ""}`}
        />
        {form.formState.errors.start_date && (
          <p className="text-destructive text-sm">
            {form.formState.errors.start_date.message}
          </p>
        )}
      </div>

      <div>
        <Input
          type="date"
          placeholder={t("elections.end_date")}
          {...form.register("end_date")}
          className={`glass ${direction === "rtl" ? "text-right" : ""}`}
        />
        {form.formState.errors.end_date && (
          <p className="text-destructive text-sm">
            {form.formState.errors.end_date.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder={t("elections.description")}
          {...form.register("description")}
          className="glass"
        />
        {form.formState.errors.description && (
          <p className="text-destructive text-sm">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="glass-button bg-gradient-primary text-white"
        >
          {t("common.save")}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="glass-button"
          >
            {t("common.cancel")}
          </Button>
        )}
      </div>
    </form>
  );
};
