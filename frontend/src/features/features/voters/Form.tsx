import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { VoterFormData } from "./types";
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
  full_name: z.string().min(1),
  national_id: z.string().min(1),
  birth_date: z.string().min(1),
  gender: z.enum(["male", "female"]),
  mobile: z.string().min(1),
  email: z.string().email().optional(),
  address: z.string().optional(),
});

interface Props {
  defaultValues?: VoterFormData;
  onSubmit: (data: VoterFormData) => void;
  onCancel?: () => void;
}

export const VoterForm = ({ defaultValues, onSubmit, onCancel }: Props) => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const form = useForm<VoterFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Input
          placeholder={t("voters.full_name")}
          {...form.register("full_name")}
          className="glass"
        />
        {form.formState.errors.full_name && (
          <p className="text-destructive text-sm">
            {form.formState.errors.full_name.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder={t("voters.national_id")}
          {...form.register("national_id")}
          className="glass"
        />
        {form.formState.errors.national_id && (
          <p className="text-destructive text-sm">
            {form.formState.errors.national_id.message}
          </p>
        )}
      </div>

      <div>
        <Input
          type="date"
          placeholder={t("voters.birth_date")}
          {...form.register("birth_date")}
          className={`glass ${direction === "rtl" ? "text-right" : ""}`}
        />
        {form.formState.errors.birth_date && (
          <p className="text-destructive text-sm">
            {form.formState.errors.birth_date.message}
          </p>
        )}
      </div>

      <div>
        <Select
          defaultValue={form.watch("gender")}
          onValueChange={(val) =>
            form.setValue("gender", val as VoterFormData["gender"])
          }
        >
          <SelectTrigger className="glass">
            <SelectValue placeholder={t("voters.gender")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">
              {t("voters.gender_options.male")}
            </SelectItem>
            <SelectItem value="female">
              {t("voters.gender_options.female")}
            </SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.gender && (
          <p className="text-destructive text-sm">
            {form.formState.errors.gender.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder={t("voters.phone")}
          {...form.register("mobile")}
          className="glass"
        />
        {form.formState.errors.mobile && (
          <p className="text-destructive text-sm">
            {form.formState.errors.mobile.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder={t("voters.email")}
          {...form.register("email")}
          className="glass"
        />
        {form.formState.errors.email && (
          <p className="text-destructive text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder={t("voters.address")}
          {...form.register("address")}
          className="glass"
        />
        {form.formState.errors.address && (
          <p className="text-destructive text-sm">
            {form.formState.errors.address.message}
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
