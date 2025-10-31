import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import {
  useCircles,
  useDistricts,
  useGovernorates,
} from "@shared/api/geo.hooks";
import { useLanguage } from "@shared/contexts/LanguageContext";
import { cn } from "@shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Skeleton } from "@shared/ui/skeleton";
import { createCampaign } from "../api";
import type { Campaign } from "@/types";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "يجب أن يكون اسم الحملة 3 أحرف على الأقل")
    .max(120, "الحد الأقصى 120 حرفًا"),
  description: z
    .string()
    .max(500, "الوصف يجب ألا يتجاوز 500 حرف")
    .optional()
    .or(z.literal("")),
  governorateId: z
    .string({ required_error: "اختر المحافظة" })
    .min(1, "اختر المحافظة"),
  districtId: z
    .string({ required_error: "اختر المركز أو المدينة" })
    .min(1, "اختر المركز أو المدينة"),
  circleId: z
    .string({ required_error: "اختر الدائرة الانتخابية" })
    .min(1, "اختر الدائرة الانتخابية"),
});

export type CreateCampaignFormValues = z.infer<typeof formSchema>;

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (campaign: Campaign) => void;
}

const toNullableNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const CreateCampaignDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateCampaignDialogProps) => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const form = useForm<CreateCampaignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      governorateId: "",
      districtId: "",
      circleId: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        name: "",
        description: "",
        governorateId: "",
        districtId: "",
        circleId: "",
      });
    }
  }, [form, open]);

  const governoratesQuery = useGovernorates();
  const governorates = governoratesQuery.data ?? [];
  const selectedGovernorateId = form.watch("governorateId");
  const governorateId = selectedGovernorateId
    ? Number(selectedGovernorateId)
    : undefined;

  const districtsQuery = useDistricts(governorateId);
  const districts = districtsQuery.data ?? [];
  const selectedDistrictId = form.watch("districtId");
  const districtId = selectedDistrictId ? Number(selectedDistrictId) : undefined;

  const circlesQuery = useCircles(districtId);
  const circles = circlesQuery.data ?? [];

  const isLoadingGovernorates = governoratesQuery.isLoading;
  const isLoadingDistricts =
    districtsQuery.isLoading || districtsQuery.isFetching;
  const isLoadingCircles = circlesQuery.isLoading || circlesQuery.isFetching;

  const governorateErrorText =
    language === "ar"
      ? "تعذّر تحميل بيانات المحافظات. حاول مرة أخرى."
      : "Failed to load governorates. Please try again.";
  const governorateEmptyText =
    language === "ar"
      ? "لا توجد محافظات متاحة حالياً."
      : "No governorates available right now.";
  const districtErrorText =
    language === "ar"
      ? "تعذّر تحميل بيانات المراكز."
      : "Failed to load districts.";
  const districtEmptyText =
    language === "ar"
      ? "لا توجد مراكز مرتبطة بالمحافظة المختارة."
      : "No districts available for the selected governorate.";
  const circleErrorText =
    language === "ar"
      ? "تعذّر تحميل بيانات الدوائر الانتخابية."
      : "Failed to load circles.";
  const circleEmptyText =
    language === "ar"
      ? "لا توجد دوائر متاحة للمركز المختار."
      : "No circles available for the selected district.";

  const createMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: (campaign) => {
      void queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      onSuccess?.(campaign);
      form.reset();
      onOpenChange(false);
    },
  });

  const handleSubmit = (values: CreateCampaignFormValues) => {
    const description = values.description?.trim();
    const payload = {
      name: values.name,
      description: description ? description : null,
      governorate_id: toNullableNumber(values.governorateId),
      district_id: toNullableNumber(values.districtId),
      circle_id: toNullableNumber(values.circleId),
    } as Parameters<typeof createCampaign>[0];

    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {language === "ar" ? "إنشاء حملة جديدة" : "Create a new campaign"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {language === "ar"
              ? "حدد بيانات الحملة واختر النطاق الجغرافي المرتبط بها"
              : "Configure campaign details and bind it to a geographic scope."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      {language === "ar" ? "اسم الحملة" : "Campaign name"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={
                          language === "ar" ? "أدخل اسم الحملة" : "Campaign name"
                        }
                        className="glass"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      {language === "ar" ? "الوصف" : "Description"}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder={
                          language === "ar"
                            ? "أضف وصفاً للحملة"
                            : "Describe the campaign"
                        }
                        className="glass"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="governorateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === "ar" ? "المحافظة" : "Governorate"}</FormLabel>
                    {isLoadingGovernorates ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("districtId", "");
                            form.setValue("circleId", "");
                          }}
                          disabled={
                            governoratesQuery.isError || !governorates.length
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="glass">
                              <SelectValue
                                placeholder={
                                  language === "ar"
                                    ? "اختر المحافظة"
                                    : "Select governorate"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {governorates.map((governorate) => (
                              <SelectItem
                                key={governorate.id}
                                value={String(governorate.id)}
                              >
                                {governorate.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {governoratesQuery.isError ? (
                          <p className="mt-2 text-sm text-destructive">
                            {governorateErrorText}
                          </p>
                        ) : null}
                        {!governoratesQuery.isError &&
                        !governorates.length ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {governorateEmptyText}
                          </p>
                        ) : null}
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="districtId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "ar" ? "المركز / المدينة" : "Center / City"}
                    </FormLabel>
                    {isLoadingDistricts ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("circleId", "");
                          }}
                          disabled={
                            !selectedGovernorateId || districtsQuery.isError
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="glass">
                              <SelectValue
                                placeholder={
                                  language === "ar"
                                    ? "اختر المركز أو المدينة"
                                    : "Select center or city"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem
                                key={district.id}
                                value={String(district.id)}
                              >
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {districtsQuery.isError ? (
                          <p className="mt-2 text-sm text-destructive">
                            {districtErrorText}
                          </p>
                        ) : null}
                        {selectedGovernorateId &&
                        !districtsQuery.isError &&
                        !districts.length ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {districtEmptyText}
                          </p>
                        ) : null}
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="circleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "ar" ? "الدائرة" : "Constituency"}
                    </FormLabel>
                    {isLoadingCircles ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={
                            !selectedDistrictId || circlesQuery.isError
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="glass">
                              <SelectValue
                                placeholder={
                                  language === "ar"
                                    ? "اختر الدائرة"
                                    : "Select constituency"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {circles.map((circle) => (
                              <SelectItem
                                key={circle.id}
                                value={String(circle.id)}
                              >
                                {circle.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {circlesQuery.isError ? (
                          <p className="mt-2 text-sm text-destructive">
                            {circleErrorText}
                          </p>
                        ) : null}
                        {selectedDistrictId &&
                        !circlesQuery.isError &&
                        !circles.length ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {circleEmptyText}
                          </p>
                        ) : null}
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className={cn(
                  "bg-gradient-primary text-white",
                  createMutation.isPending && "opacity-70",
                )}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending
                  ? language === "ar"
                    ? "جاري الإنشاء..."
                    : "Creating..."
                  : language === "ar"
                    ? "إنشاء الحملة"
                    : "Create campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
