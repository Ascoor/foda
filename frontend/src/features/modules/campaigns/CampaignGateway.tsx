import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  Loader2,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";
import { format, parseISO } from "date-fns";

import { useCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";
import { useAuth } from "@/features/legacy/hooks/useAuth";
import { Button } from "@/infrastructure/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/infrastructure/shared/ui/dialog";
import { Input } from "@/infrastructure/shared/ui/input";
import { Label } from "@/infrastructure/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/infrastructure/shared/ui/select";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";
import { StatusBadge } from "@/infrastructure/shared/ui/status-badge";
import { Textarea } from "@/infrastructure/shared/ui/textarea";
import { cn } from "@/infrastructure/shared/lib/utils";
import { fetchCampaigns, createCampaign } from "./api";
import type { Campaign, CampaignFormData, CampaignSpatialLevel } from "./types";

const sanitizePath = (candidate: unknown): string | null => {
  if (typeof candidate !== "string") return null;
  if (!candidate.startsWith("/")) return null;
  return candidate;
};

const SPATIAL_LEVEL_OPTIONS: CampaignSpatialLevel[] = [
  "region",
  "governorate",
  "center",
  "city",
  "custom",
];

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (campaign: Campaign) => void;
}

type DraftCampaignState = {
  name: string;
  description: string;
  spatialLevel: CampaignSpatialLevel;
  startsAt: string;
  endsAt: string;
};

const DEFAULT_DURATION_DAYS = 30;

const toInputDate = (date: Date) => format(date, "yyyy-MM-dd");

const ensureIsoString = (value: string, fallback: Date) => {
  try {
    if (value) {
      return new Date(value).toISOString();
    }
  } catch (error) {
    console.warn("Invalid date provided to CampaignGateway", error);
  }
  return fallback.toISOString();
};

const CreateCampaignDialog = ({
  open,
  onOpenChange,
  onCreated,
}: CreateCampaignDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<DraftCampaignState>(() => {
    const now = new Date();
    const endsAt = new Date(now);
    endsAt.setDate(now.getDate() + DEFAULT_DURATION_DAYS);
    return {
      name: "",
      description: "",
      spatialLevel: "region",
      startsAt: toInputDate(now),
      endsAt: toInputDate(endsAt),
    };
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error(t("campaigns.gateway.missing_owner"));
      }

      const payload: CampaignFormData = {
        name: draft.name.trim(),
        description: draft.description.trim() || null,
        starts_at: ensureIsoString(draft.startsAt, new Date()),
        ends_at: ensureIsoString(
          draft.endsAt,
          (() => {
            const endFallback = new Date();
            endFallback.setDate(endFallback.getDate() + DEFAULT_DURATION_DAYS);
            return endFallback;
          })(),
        ),
        owner_uuid: String(user.id),
        status: "draft",
        spatial_level: draft.spatialLevel,
        goals: [],
      };

      return createCampaign(payload);
    },
    onSuccess: (campaign) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", "gateway"] });
      onCreated(campaign);
      setDraft((current) => ({
        ...current,
        name: "",
        description: "",
      }));
      setErrorMessage(null);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(t("campaigns.gateway.create_error"));
      }
    },
  });

  const handleClose = (next: boolean) => {
    if (!next) {
      setErrorMessage(null);
    }
    onOpenChange(next);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!draft.name.trim()) {
      setErrorMessage(t("campaigns.gateway.validation.name"));
      return;
    }

    if (!draft.startsAt || !draft.endsAt) {
      setErrorMessage(t("campaigns.gateway.validation.dates"));
      return;
    }

    try {
      await mutation.mutateAsync();
      handleClose(false);
    } catch (error) {
      console.error("Failed to create campaign", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl border-white/20 bg-gradient-to-br from-slate-950/90 via-slate-900/95 to-slate-950/90 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            {t("campaigns.gateway.create_title")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/80">
              {t("campaigns.gateway.fields.name")}
            </Label>
            <Input
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
              required
              className="border-white/20 bg-white/5 text-base text-white placeholder:text-white/40"
              placeholder={t("campaigns.gateway.placeholders.name") ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/80">
              {t("campaigns.gateway.fields.description")}
            </Label>
            <Textarea
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="min-h-[120px] border-white/20 bg-white/5 text-white placeholder:text-white/40"
              placeholder={t("campaigns.gateway.placeholders.description") ?? ""}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">
                {t("campaigns.gateway.fields.starts_at")}
              </Label>
              <Input
                type="date"
                value={draft.startsAt}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    startsAt: event.target.value,
                  }))
                }
                className="border-white/20 bg-white/5 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/80">
                {t("campaigns.gateway.fields.ends_at")}
              </Label>
              <Input
                type="date"
                value={draft.endsAt}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    endsAt: event.target.value,
                  }))
                }
                className="border-white/20 bg-white/5 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/80">
              {t("campaigns.gateway.fields.spatial_level")}
            </Label>
            <Select
              value={draft.spatialLevel}
              onValueChange={(value: CampaignSpatialLevel) =>
                setDraft((current) => ({ ...current, spatialLevel: value }))
              }
            >
              <SelectTrigger className="border-white/20 bg-white/5 text-white">
                <SelectValue placeholder={t("campaigns.gateway.placeholders.spatial_level") ?? ""} />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 text-white">
                {SPATIAL_LEVEL_OPTIONS.map((level) => (
                  <SelectItem key={level} value={level} className="capitalize">
                    {t(`campaigns.gateway.spatial_levels.${level}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleClose(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="floating"
              disabled={mutation.isPending}
              className="min-w-[160px]"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t("campaigns.gateway.actions.launch")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const formatDateRange = (campaign: Campaign, locale: string) => {
  if (!campaign.starts_at || !campaign.ends_at) {
    return null;
  }

  try {
    const start = typeof campaign.starts_at === "string" ? parseISO(campaign.starts_at) : new Date(campaign.starts_at);
    const end = typeof campaign.ends_at === "string" ? parseISO(campaign.ends_at) : new Date(campaign.ends_at);
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${formatter.format(start)} — ${formatter.format(end)}`;
  } catch (error) {
    console.warn("Unable to format campaign date range", error);
    return null;
  }
};

const CampaignGateway = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { setCampaignId, campaignId } = useCampaignContext();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const requestedReturnTo = useMemo(() => {
    const fromQuery = sanitizePath(params.get("returnTo"));
    const fromState = sanitizePath((location.state as { returnTo?: string } | undefined)?.returnTo);
    return fromQuery ?? fromState ?? "/dashboard";
  }, [location.state, params]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["campaigns", "gateway"],
    queryFn: () => fetchCampaigns(),
    staleTime: 1000 * 30,
  });

  const campaigns = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  useEffect(() => {
    if (selectedCampaignId || !campaigns.length) {
      return;
    }
    const initial = campaigns.find((entry) => String(entry.id) === String(campaignId));
    if (initial) {
      setSelectedCampaignId(String(initial.id));
    }
  }, [campaignId, campaigns, selectedCampaignId]);

  const marqueeItems = useMemo(() => {
    if (!campaigns.length) {
      return [];
    }
    const names = campaigns.map((campaign) => campaign.name ?? String(campaign.id));
    return [...names, ...names];
  }, [campaigns]);

  const handleEnter = (campaign: Campaign) => {
    setCampaignId(campaign.id);
    navigate(requestedReturnTo, { replace: true, state: undefined });
  };

  const handleCreated = (campaign: Campaign) => {
    setIsCreateOpen(false);
    setCampaignId(campaign.id);
    navigate(requestedReturnTo, { replace: true, state: undefined });
  };

  const selected = campaigns.find((entry) => String(entry.id) === selectedCampaignId) ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm text-white/70">
            <Sparkles className="h-4 w-4 text-amber-300" />
            {t("campaigns.gateway.preamble")}
          </div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            {t("campaigns.gateway.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 sm:text-lg">
            {t("campaigns.gateway.subtitle")}
          </p>
        </header>

        <section className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div
              className="flex min-w-max gap-8 py-4 text-sm font-medium uppercase tracking-[0.3em] text-white/70 animate-marquee"
              style={{ animationDuration: `${Math.max(18, campaigns.length * 4)}s` }}
            >
              {marqueeItems.length ? (
                marqueeItems.map((name, index) => (
                  <span key={`${name}-${index}`} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {name}
                  </span>
                ))
              ) : (
                <span className="flex w-full items-center justify-center gap-2 text-white/40">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isLoading
                    ? t("campaigns.gateway.loading")
                    : t("campaigns.gateway.empty_marquee")}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">
                {t("campaigns.gateway.choose_prompt")}
              </p>
              {selected ? (
                <p className="text-lg font-medium text-white">
                  {t("campaigns.gateway.selected", { name: selected.name })}
                </p>
              ) : (
                <p className="text-lg font-medium text-white/70">
                  {t("campaigns.gateway.no_selection")}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="glass"
                className="text-white"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="h-4 w-4" />
                {t("campaigns.gateway.actions.new")}
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => navigate("/campaigns", { state: { returnTo: requestedReturnTo } })}
              >
                {t("campaigns.gateway.actions.manage")}
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-white/10 bg-white/5">
                <CardHeader>
                  <Skeleton className="h-6 w-1/3 bg-white/10" />
                  <Skeleton className="h-4 w-1/2 bg-white/10" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-3 w-3/4 bg-white/10" />
                  <Skeleton className="h-3 w-2/3 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full bg-white/10" />
                </CardFooter>
              </Card>
            ))
          ) : isError ? (
            <Card className="md:col-span-2 xl:col-span-3 border-white/10 bg-rose-500/10 text-rose-100">
              <CardHeader>
                <CardTitle>{t("campaigns.gateway.error_title")}</CardTitle>
                <CardDescription className="text-rose-100/80">
                  {t("campaigns.gateway.error_description")}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="floating" onClick={() => refetch()}>
                  <Loader2 className="h-4 w-4" />
                  {t("campaigns.gateway.actions.retry")}
                </Button>
              </CardFooter>
            </Card>
          ) : campaigns.length === 0 ? (
            <Card className="md:col-span-2 xl:col-span-3 border-dashed border-white/20 bg-white/5 text-center">
              <CardHeader className="items-center">
                <CardTitle className="text-2xl text-white">
                  {t("campaigns.gateway.empty_state.title")}
                </CardTitle>
                <CardDescription className="max-w-xl text-white/70">
                  {t("campaigns.gateway.empty_state.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center gap-3">
                <Button variant="floating" onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4" />
                  {t("campaigns.gateway.actions.new")}
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate("/campaigns")}
                >
                  {t("campaigns.gateway.actions.manage")}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            campaigns.map((campaign) => {
              const isSelected = String(campaign.id) === selectedCampaignId;
              const windowLabel = formatDateRange(campaign, i18n.language);

              return (
                <Card
                  key={campaign.id}
                  className={cn(
                    "cursor-pointer border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow",
                    isSelected && "border-primary/80 bg-primary/10 shadow-glow",
                  )}
                  onClick={() => setSelectedCampaignId(String(campaign.id))}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-white">
                        {campaign.name}
                      </CardTitle>
                      <StatusBadge status={campaign.status ?? "draft"} className="bg-white/10 text-white" />
                    </div>
                    <CardDescription className="text-white/70">
                      {campaign.description || t("campaigns.gateway.no_description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-white/70">
                    {windowLabel ? (
                      <div className="flex items-center gap-2">
                        <CalendarRange className="h-4 w-4" />
                        {windowLabel}
                      </div>
                    ) : null}
                    {campaign.spatial_level ? (
                      <div className="flex items-center gap-2 capitalize">
                        <MapPin className="h-4 w-4" />
                        {t(`campaigns.gateway.spatial_levels.${campaign.spatial_level as CampaignSpatialLevel}`)}
                      </div>
                    ) : null}
                    {campaign.sent !== undefined || campaign.delivered !== undefined ? (
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
                        <span>
                          {t("campaigns.gateway.metrics.sent", { value: campaign.sent ?? 0 })}
                        </span>
                        <span>
                          {t("campaigns.gateway.metrics.delivered", { value: campaign.delivered ?? 0 })}
                        </span>
                      </div>
                    ) : null}
                  </CardContent>
                  <CardFooter className="justify-between">
                    <Button
                      variant={isSelected ? "floating" : "glass"}
                      className={cn("flex-1", isSelected ? "bg-gradient-primary text-white" : "text-white")}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedCampaignId(String(campaign.id));
                        handleEnter(campaign);
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                      {t("campaigns.gateway.actions.enter")}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </section>

        <footer className="mt-auto flex flex-col items-center gap-2 pb-6 text-center text-xs text-white/40">
          <span>{t("campaigns.gateway.footer_hint")}</span>
          <span className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            {t("campaigns.gateway.footer_cta")}
          </span>
        </footer>
      </div>

      <CreateCampaignDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default CampaignGateway;
