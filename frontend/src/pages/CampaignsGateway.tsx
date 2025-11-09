import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Edit2,
  Loader2,
  Plus,
} from "lucide-react";
import clsx from "clsx";
import { isAxiosError } from "axios";

import {
  request,
  type ApiErrorResponse,
  type ApiResponse,
} from "@/infrastructure/shared/lib/api";
import { useCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";
import { Button } from "@/infrastructure/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/infrastructure/shared/ui/dialog";
import { Input } from "@/infrastructure/shared/ui/input";
import { Label } from "@/infrastructure/shared/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/infrastructure/shared/ui/alert";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";
import { toast } from "@/infrastructure/shared/ui/use-toast";

const CAMPAIGNS_ENDPOINT = "/api/v1/campaigns";

type CampaignSummary = {
  id: number;
  name: string;
  slug: string;
  status?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
};

type FormValues = {
  name: string;
  slug: string;
  status: string;
  starts_at: string;
  ends_at: string;
};

type FormState = {
  mode: "create" | "edit";
  campaign?: CampaignSummary;
};

const STATUS_LABELS: Record<string, string> = {
  active: "نشطة",
  draft: "مسودة",
  paused: "موقوفة",
  completed: "مكتملة",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40",
  draft: "bg-slate-500/20 text-slate-200 border border-slate-400/40",
  paused: "bg-amber-500/20 text-amber-200 border border-amber-400/40",
  completed: "bg-sky-500/20 text-sky-200 border border-sky-400/40",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return dateFormatter.format(parsed);
};

const extractErrorMessages = (error: unknown): string[] => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const payload = error.response?.data;
    const messages: string[] = [];

    const collect = (source: unknown) => {
      if (!source) return;
      if (Array.isArray(source)) {
        source.forEach(collect);
        return;
      }
      if (typeof source === "object") {
        Object.values(source as Record<string, unknown>).forEach(collect);
        return;
      }
      if (typeof source === "string" && source.trim()) {
        messages.push(source.trim());
      }
    };

    collect(payload?.errors);

    if (payload && typeof payload.message === "string" && payload.message.trim()) {
      messages.push(payload.message.trim());
    }

    if (payload && typeof payload.data === "string" && payload.data.trim()) {
      messages.push(payload.data.trim());
    }

    if (!messages.length && typeof error.message === "string") {
      messages.push(error.message);
    }

    return Array.from(new Set(messages));
  }

  if (error instanceof Error) {
    return error.message ? [error.message] : [];
  }

  if (typeof error === "string" && error.trim()) {
    return [error.trim()];
  }

  return [];
};

const buildInitialValues = (campaign?: CampaignSummary): FormValues => ({
  name: campaign?.name ?? "",
  slug: campaign?.slug ?? "",
  status: campaign?.status ?? "active",
  starts_at: campaign?.starts_at ? campaign.starts_at.slice(0, 10) : "",
  ends_at: campaign?.ends_at ? campaign.ends_at.slice(0, 10) : "",
});

const CampaignFormModal = ({
  open,
  onClose,
  onSubmit,
  submitting,
  initialCampaign,
  mode,
  errors,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
  submitting: boolean;
  initialCampaign?: CampaignSummary;
  mode: FormState["mode"];
  errors: string[];
}) => {
  const [values, setValues] = useState<FormValues>(() =>
    buildInitialValues(initialCampaign),
  );

  useEffect(() => {
    setValues(buildInitialValues(initialCampaign));
  }, [initialCampaign]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl border-white/10 bg-slate-950/80 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            {mode === "create" ? "إضافة حملة جديدة" : "تحديث معلومات الحملة"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-300">
            {mode === "create"
              ? "أدخل تفاصيل الحملة لبدء العمل عليها."
              : "حدّث الحقول المطلوبة ثم احفظ التغييرات."}
          </DialogDescription>
        </DialogHeader>

        {errors.length > 0 && (
          <Alert variant="destructive" className="border-red-500/40 bg-red-500/10">
            <AlertTitle>تعذر حفظ البيانات</AlertTitle>
            <AlertDescription>
              <ul className="list-disc space-y-1 pl-4">
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                اسم الحملة
              </Label>
              <Input
                id="name"
                name="name"
                required
                value={values.name}
                onChange={handleChange}
                placeholder="حملة القاهرة"
                className="border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-indigo-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-slate-200">
                المعرّف (Slug)
              </Label>
              <Input
                id="slug"
                name="slug"
                required
                value={values.slug}
                onChange={handleChange}
                placeholder="cairo-campaign"
                className="border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:ring-indigo-400"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-200">
                الحالة
              </Label>
              <select
                id="status"
                name="status"
                value={values.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="active">نشطة</option>
                <option value="draft">مسودة</option>
                <option value="paused">موقوفة</option>
                <option value="completed">مكتملة</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="starts_at" className="text-slate-200">
                تاريخ البداية
              </Label>
              <Input
                id="starts_at"
                name="starts_at"
                type="date"
                value={values.starts_at}
                onChange={handleChange}
                className="border-white/10 bg-white/5 text-white focus-visible:ring-indigo-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ends_at" className="text-slate-200">
                تاريخ النهاية
              </Label>
              <Input
                id="ends_at"
                name="ends_at"
                type="date"
                value={values.ends_at}
                onChange={handleChange}
                className="border-white/10 bg-white/5 text-white focus-visible:ring-indigo-400"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/20 bg-transparent text-slate-200 hover:bg-white/10"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={submitting || !values.name.trim() || !values.slug.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:to-purple-400"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جارٍ الحفظ
                </span>
              ) : mode === "create" ? (
                "حفظ الحملة"
              ) : (
                "تحديث الحملة"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CampaignsGateway = () => {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { campaignId, setCampaignId } = useCampaignContext();
  const navigate = useNavigate();

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request<ApiResponse<CampaignSummary[]>>({
        url: CAMPAIGNS_ENDPOINT,
        method: "get",
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setCampaigns(data);
    } catch (err) {
      const [message] = extractErrorMessages(err);
      setError(message ?? "تعذر تحميل الحملات المتاحة.");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  const handleSelectCampaign = useCallback(
    (campaign: CampaignSummary) => {
      const normalized = setCampaignId(campaign.id);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("campaign_id", normalized);
        window.localStorage.setItem("campaign_slug", campaign.slug);
      }

      toast({
        title: "تم اختيار الحملة",
        description: `${campaign.name} جاهزة الآن في لوحة التحكم`,
      });

      navigate(`/dashboard/${campaign.id}`);
    },
    [navigate, setCampaignId],
  );

  const handleOpenCreate = () => {
    setFormErrors([]);
    setFormState({ mode: "create" });
  };

  const handleOpenEdit = (campaign: CampaignSummary) => {
    setFormErrors([]);
    setFormState({ mode: "edit", campaign });
  };

  const handleSubmitForm = async (values: FormValues) => {
    if (!formState) return;

    const payload = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      status: values.status.trim() || "draft",
      starts_at: values.starts_at.trim() || null,
      ends_at: values.ends_at.trim() || null,
    };

    setSaving(true);
    setFormErrors([]);

    try {
      if (formState.mode === "edit" && formState.campaign) {
        await request<ApiResponse<CampaignSummary>>({
          url: `${CAMPAIGNS_ENDPOINT}/${formState.campaign.id}`,
          method: "put",
          data: payload,
        });
        toast({
          title: "تم تحديث الحملة",
          description: "التغييرات محفوظة الآن",
        });
      } else {
        const response = await request<ApiResponse<CampaignSummary>>({
          url: CAMPAIGNS_ENDPOINT,
          method: "post",
          data: payload,
        });
        toast({
          title: "تم إنشاء الحملة",
          description: `${response.data.name} أضيفت إلى بوابة الحملات`,
        });
      }

      setFormState(null);
      await loadCampaigns();
    } catch (err) {
      const messages = extractErrorMessages(err);
      setFormErrors(messages.length ? messages : ["حدث خطأ غير متوقع"]);
    } finally {
      setSaving(false);
    }
  };

  const activeCampaignId = useMemo(() => campaignId, [campaignId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3">
          <Badge className="w-fit bg-white/10 text-indigo-200">
            بوابة الحملات
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            اختر حملتك للمتابعة
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            جميع الحملات المصرح بها لك في مكان واحد. اختر واحدة للانتقال إلى
            لوحة التحكم أو أنشئ حملة جديدة لتبدأ العمل عليها فورًا.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-300">
            {campaigns.length > 0
              ? `${campaigns.length} حملة متاحة`
              : "لا توجد حملات مرتبطة حتى الآن"}
          </div>
          <Button
            onClick={handleOpenCreate}
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:to-purple-400"
          >
            <Plus className="h-4 w-4" />
            إضافة حملة جديدة
          </Button>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/30">
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="h-44 min-w-[280px] rounded-2xl border border-white/10 bg-white/10"
                />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive" className="border-red-500/40 bg-red-500/10">
              <AlertTitle>تعذر تحميل الحملات</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              <AnimatePresence initial={false}>
                {campaigns.map((campaign) => {
                  const isActive = String(campaign.id) === activeCampaignId;
                  const statusKey = (campaign.status ?? "draft").toLowerCase();
                  const badgeClass = STATUS_STYLES[statusKey] ?? STATUS_STYLES.draft;
                  const badgeLabel = STATUS_LABELS[statusKey] ?? STATUS_LABELS.draft;

                  return (
                    <motion.button
                      key={campaign.id}
                      layout
                      whileHover={{ y: -6 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectCampaign(campaign)}
                      className={clsx(
                        "group relative flex min-h-[180px] min-w-[280px] flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left transition",
                        "from-slate-900/80 via-slate-900/60 to-slate-900/80",
                        "border-white/10 hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/20",
                        isActive && "border-indigo-400/80 ring-2 ring-indigo-400/60",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-white">
                            {campaign.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              {formatDate(campaign.starts_at)}
                              <span className="mx-1 text-slate-500">–</span>
                              {formatDate(campaign.ends_at)}
                            </span>
                          </div>
                        </div>
                        <Badge className={clsx("rounded-full px-3 py-1 text-xs", badgeClass)}>
                          {badgeLabel}
                        </Badge>
                      </div>

                      <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
                        <div className="inline-flex items-center gap-2 text-indigo-200">
                          انتقل إلى اللوحة
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenEdit(campaign);
                          }}
                          className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/20"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {!loading && campaigns.length === 0 && (
                <div className="flex min-h-[180px] min-w-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 text-center text-slate-300">
                  لا توجد حملات مرتبطة حتى الآن
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {formState && (
        <CampaignFormModal
          open={Boolean(formState)}
          mode={formState.mode}
          initialCampaign={formState.campaign}
          onClose={() => {
            if (!saving) {
              setFormState(null);
            }
          }}
          submitting={saving}
          onSubmit={handleSubmitForm}
          errors={formErrors}
        />
      )}
    </div>
  );
};

export default CampaignsGateway;
export { CampaignsGateway };
