import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { useLanguage } from "@shared/contexts/LanguageContext";
import { cn, safeArray } from "@shared/lib/utils";
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
import { createCampaign, fetchEgyptGeoAreas } from "../api";
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
  governorate: z.string({ required_error: "اختر المحافظة" }),
  center: z.string({ required_error: "اختر المركز أو المدينة" }),
  constituency: z.string({ required_error: "اختر الدائرة الانتخابية" }),
});

export type CreateCampaignFormValues = z.infer<typeof formSchema>;

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (campaign: Campaign) => void;
}

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
      governorate: "",
      center: "",
      constituency: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        name: "",
        description: "",
        governorate: "",
        center: "",
        constituency: "",
      });
    }
  }, [form, open]);

  const { data: geoAreas, isLoading: isLoadingGeo } = useQuery({
    queryKey: ["egypt-geo-areas"],
    queryFn: fetchEgyptGeoAreas,
    staleTime: 1000 * 60 * 15,
  });

  const governorates = useMemo(
    () => safeArray(geoAreas).filter((area) => area.type === "governorate"),
    [geoAreas],
  );

  const governorateValue = form.watch("governorate");
  const centerValue = form.watch("center");

  const centers = useMemo(
    () =>
      safeArray(geoAreas).filter(
        (area) =>
          (area.type === "district" || area.type === "city") &&
          area.parentId === governorateValue,
      ),
    [geoAreas, governorateValue],
  );

  const constituencies = useMemo(
    () =>
      safeArray(geoAreas).filter(
        (area) => area.type === "village" && area.parentId === centerValue,
      ),
    [geoAreas, centerValue],
  );

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
    const payload = {
      name: values.name,
      description: values.description,
      geo_scope: {
        governorate_id: values.governorate,
        center_id: values.center,
        constituency_id: values.constituency,
      },
    } as unknown as Parameters<typeof createCampaign>[0];

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
                name="governorate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === "ar" ? "المحافظة" : "Governorate"}</FormLabel>
                    {isLoadingGeo ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("center", "");
                          form.setValue("constituency", "");
                        }}
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
                            <SelectItem key={governorate.id} value={governorate.id}>
                              {governorate.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="center"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "ar" ? "المركز / المدينة" : "Center / City"}
                    </FormLabel>
                    {isLoadingGeo ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("constituency", "");
                        }}
                        disabled={!governorates.length}
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
                          {centers.map((center) => (
                            <SelectItem key={center.id} value={center.id}>
                              {center.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="constituency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {language === "ar" ? "الدائرة" : "Constituency"}
                    </FormLabel>
                    {isLoadingGeo ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!centers.length}
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
                          {constituencies.map((constituency) => (
                            <SelectItem key={constituency.id} value={constituency.id}>
                              {constituency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
