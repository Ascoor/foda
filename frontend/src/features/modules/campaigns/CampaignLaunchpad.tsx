import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Loader2,
  PlusCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { CampaignForm } from "./CampaignForm";
import { fetchCampaigns } from "./api";
import type { Campaign } from "./types";

import { useCampaignContext } from "@/infrastructure/shared/contexts/CampaignContext";
import { safeArray } from "@/infrastructure/shared/lib/safeData";
import { cn } from "@/infrastructure/shared/lib/utils";
import { Button } from "@/infrastructure/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";
import { Badge } from "@/infrastructure/shared/ui/badge";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";

const sanitizePath = (candidate: string | null): string | null => {
  if (!candidate) return null;
  if (!candidate.startsWith("/")) return null;
  return candidate;
};

const FALLBACK_DESTINATION = "/dashboard";

const formatDate = (value: string, locale: string) => {
  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formatter.format(new Date(value));
  } catch (error) {
    console.warn("Failed to format date", error);
    return "--";
  }
};

export const CampaignLaunchpad = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { campaignId, setCampaignId } = useCampaignContext();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(
    campaignId ? String(campaignId) : null,
  );

  const destination = useMemo(
    () => sanitizePath(params.get("returnTo")) ?? FALLBACK_DESTINATION,
    [params],
  );

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCampaigns();
      setCampaigns(safeArray(response?.data));
    } catch (err) {
      console.error("Failed to load campaigns", err);
      if (err instanceof Error && err.message.trim()) {
        setError(`${t("campaigns.launchpad.error")}: ${err.message}`);
      } else {
        setError(t("campaigns.launchpad.error"));
      }
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    setSelectedId(campaignId ? String(campaignId) : null);
  }, [campaignId]);

  const handleActivate = (identifier: Campaign["id"]) => {
    setSelectedId(String(identifier));
    setCampaignId(identifier);
    setIsActivating(true);
    setTimeout(() => {
      navigate(destination, { replace: true });
    }, 550);
  };

  const handleStartNew = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    void loadCampaigns();
  };

  const statusLabel = (status: Campaign["status"]) =>
    t(`campaigns.status.${status}`, {
      defaultValue: status,
    });

  const timeline = (campaign: Campaign) =>
    t("campaigns.launchpad.timeline", {
      start: formatDate(campaign.starts_at, i18n.language),
      end: formatDate(campaign.ends_at, i18n.language),
    });

  const totalCampaigns = campaigns.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/25 via-background to-secondary/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.35),transparent_55%)]"
      />

      <header className="relative z-10 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div className="flex items-center gap-3 text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-primary">
                {t("campaigns.launchpad.title")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("campaigns.launchpad.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs uppercase tracking-[0.32em]"
              onClick={() => void loadCampaigns()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {t("campaigns.launchpad.refresh")}
            </Button>
            <Button
              onClick={handleStartNew}
              className="gap-2 bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
            >
              <PlusCircle className="h-4 w-4" />
              {t("campaigns.launchpad.create_button")}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        {error && (
          <motion.div
            role="alert"
            className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/80 p-8 shadow-[0_35px_120px_rgba(79,70,229,0.12)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.22),transparent_60%)]" />
            <div className="relative space-y-6">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-2 border border-white/20 bg-secondary/10 text-xs font-semibold uppercase tracking-[0.32em]"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t("campaigns.launchpad.active_hint", { count: totalCampaigns })}
              </Badge>
              <div className="space-y-4">
                <h1 className="text-balance text-3xl font-semibold text-white drop-shadow-sm sm:text-4xl">
                  {t("campaigns.launchpad.hero_title")}
                </h1>
                <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
                  {t("campaigns.launchpad.hero_description")}
                </p>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Activity className="h-4 w-4" />
                  </span>
                  <span>{t("campaigns.launchpad.point_operate")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <span>{t("campaigns.launchpad.point_timeline")}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span>{t("campaigns.launchpad.point_switch")}</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            className="relative grid gap-6 sm:grid-cols-2"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="h-44 rounded-3xl border border-white/10 bg-background/60"
                />
              ))
            ) : campaigns.length > 0 ? (
              campaigns.map((campaign) => {
                const isSelected = selectedId === String(campaign.id);
                const isActiveCampaign = String(campaignId) === String(campaign.id);
                return (
                  <Card
                    key={campaign.id}
                    className={cn(
                      "group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-background/80 p-6 text-left shadow-lg shadow-primary/5 transition-all duration-300 hover:border-primary/30",
                      isSelected &&
                        "border-primary/50 shadow-primary/20 ring-2 ring-primary/40",
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <CardHeader className="relative p-0">
                      <CardTitle className="text-xl font-semibold text-white">
                        {campaign.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {timeline(campaign)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative mt-6 space-y-4 p-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/20 text-xs text-primary">
                          {statusLabel(campaign.status)}
                        </Badge>
                        {isActiveCampaign && (
                          <Badge
                            variant="secondary"
                            className="bg-secondary/20 text-xs"
                          >
                            {t("campaigns.launchpad.current_badge")}
                          </Badge>
                        )}
                      </div>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {campaign.description ||
                          t("campaigns.launchpad.empty_description")}
                      </p>
                      <Button
                        onClick={() => handleActivate(campaign.id)}
                        className="group/button w-full justify-between bg-gradient-to-r from-primary to-secondary text-white"
                      >
                        <span>{t("campaigns.launchpad.enter_button")}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1.5" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="col-span-full flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-background/60 p-10 text-center">
                <Sparkles className="h-10 w-10 text-primary" />
                <CardTitle className="mt-4 text-2xl text-white">
                  {t("campaigns.launchpad.empty_title")}
                </CardTitle>
                <CardDescription className="mt-2 max-w-md text-sm text-muted-foreground">
                  {t("campaigns.launchpad.empty_state")}
                </CardDescription>
                <Button
                  onClick={handleStartNew}
                  className="mt-6 bg-gradient-to-r from-primary to-secondary text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("campaigns.launchpad.create_button")}
                </Button>
              </Card>
            )}
          </motion.div>
        </section>
        <p className="text-center text-xs text-muted-foreground">
          {t("campaigns.launchpad.switch_hint")}
        </p>
      </main>

      <AnimatePresence>
        {isActivating && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-background/90 px-10 py-8 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                  {t("campaigns.launchpad.activating")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("campaigns.launchpad.activating_subtitle")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CampaignForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default CampaignLaunchpad;
