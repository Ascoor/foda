import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Campaign, campaignService } from "@/services/campaignService";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

import { CampaignPicker } from "./CampaignPicker";

const layoutMotion = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -32 },
};

const useOffline = () => {
  const [offline, setOffline] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return !window.navigator.onLine;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const handleStatus = () => {
      setOffline(!window.navigator.onLine);
    };
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);
    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);

  return offline;
};

export const PostLoginGate = () => {
  const { direction, language } = useLanguage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const isOffline = useOffline();

  const campaignsQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => campaignService.getCampaigns(),
  });

  const createCampaignMutation = useMutation({
    mutationFn: (name: string) => campaignService.createCampaign({ name }),
    onSuccess: (newCampaign) => {
      queryClient.setQueryData<Campaign[] | undefined>(["campaigns"], (current) => {
        if (!current) {
          return [newCampaign];
        }
        return [newCampaign, ...current.filter((item) => item.id !== newCampaign.id)];
      });
      setSelectedCampaignId(newCampaign.id);
      setIsDialogOpen(false);
      setCampaignName("");
      setNameError(null);
      navigate(`/dashboard/${newCampaign.id}`);
    },
    onError: (error: Error) => {
      setNameError(error.message);
    },
  });

  const campaigns = campaignsQuery.data ?? [];

  useEffect(() => {
    if (!campaigns.length) {
      setSelectedCampaignId("");
      return;
    }

    const exists = campaigns.some((campaign) => campaign.id === selectedCampaignId);
    if (!selectedCampaignId || !exists) {
      setSelectedCampaignId(campaigns[0]?.id ?? "");
    }
  }, [campaigns, selectedCampaignId]);

  const handleCreateCampaign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!campaignName.trim()) {
      setNameError(language === "ar" ? "يرجى إدخال اسم الحملة" : "Please enter a campaign name");
      return;
    }
    createCampaignMutation.mutate(campaignName.trim());
  };

  const handleContinue = (campaign: Campaign) => {
    navigate(`/dashboard/${campaign.id}`);
  };

  const heading = language === "ar" ? "مرحباً!" : "Welcome";
  const subheading = language === "ar"
    ? "اختر حملتك الحالية أو أنشئ حملة جديدة للبدء"
    : "Choose a campaign or create a new one to get started";

  const hasCampaigns = campaigns.length > 0;

  return (
    <div
      className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 text-foreground"
      dir={direction}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%)]" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="text-center">
          <motion.h1
            className="text-3xl font-bold tracking-tight md:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {heading}
          </motion.h1>
          <motion.p
            className="mt-2 text-base text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            {subheading}
          </motion.p>
        </header>

        {isOffline && (
          <div className="flex items-center justify-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            <WifiOff className="size-4" />
            {language === "ar" ? "لا يوجد اتصال بالإنترنت حالياً" : "You are currently offline"}
          </div>
        )}

        <AnimatePresence mode="wait">
          {campaignsQuery.isLoading ? (
            <motion.div key="loading" {...layoutMotion} className="grid gap-6 md:grid-cols-2">
              {[0, 1].map((item) => (
                <Skeleton key={item} className="h-64 rounded-2xl bg-white/5" />
              ))}
            </motion.div>
          ) : campaignsQuery.isError ? (
            <motion.div
              key="error"
              {...layoutMotion}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-center"
            >
              <AlertTriangle className="size-10 text-red-400" />
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  {language === "ar" ? "حدث خطأ أثناء تحميل الحملات" : "We couldn't load your campaigns"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "حاول مرة أخرى خلال لحظات" : "Please try again in a moment."}
                </p>
              </div>
              <Button onClick={() => campaignsQuery.refetch()} variant="glass">
                {language === "ar" ? "إعادة المحاولة" : "Retry"}
              </Button>
            </motion.div>
          ) : hasCampaigns ? (
            <motion.div key="picker" {...layoutMotion}>
              <CampaignPicker
                campaigns={campaigns}
                direction={direction}
                selectedCampaignId={selectedCampaignId || campaigns[0]?.id || ""}
                onSelect={(campaign) => setSelectedCampaignId(campaign.id)}
                onContinue={handleContinue}
                onRequestCreate={() => setIsDialogOpen(true)}
                isCreating={createCampaignMutation.isPending}
              />
            </motion.div>
          ) : (
            <motion.div key="empty" {...layoutMotion}>
              <Card className="glass-card border-white/10 bg-white/5 shadow-glow">
                <CardHeader>
                  <CardTitle>{language === "ar" ? "ابدأ حملتك الأولى" : "Create your first campaign"}</CardTitle>
                  <CardDescription>
                    {language === "ar"
                      ? "سنُرشدك خطوة بخطوة لإطلاق حملتك الانتخابية"
                      : "We'll guide you through launching your first election campaign."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {language === "ar"
                      ? "ليس لديك أي حملات بعد. اضغط على الزر أدناه للبدء"
                      : "You don't have any campaigns yet. Use the button below to get started."}
                  </p>
                  <Button
                    variant="floating"
                    size="lg"
                    className="min-h-12"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    {language === "ar" ? "إنشاء حملة جديدة" : "Create a campaign"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setCampaignName("");
            setNameError(null);
          }
        }}
      >
        <DialogContent className="glass-card border-white/20 bg-background/90">
          <DialogHeader>
            <DialogTitle>{language === "ar" ? "حملة جديدة" : "New campaign"}</DialogTitle>
            <DialogDescription>
              {language === "ar"
                ? "أدخل اسم الحملة لبدء الإعداد"
                : "Give your campaign a name to get started."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCampaign} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="campaign-name">
                {language === "ar" ? "اسم الحملة" : "Campaign name"}
              </label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(event) => {
                  setCampaignName(event.target.value);
                  if (nameError) {
                    setNameError(null);
                  }
                }}
                placeholder={language === "ar" ? "مثال: حملة الربيع" : "e.g. Spring Momentum"}
                autoFocus
                minLength={2}
                aria-invalid={Boolean(nameError)}
              />
              {nameError && (
                <p className="text-sm text-red-400" role="alert">
                  {nameError}
                </p>
              )}
            </div>
            <DialogFooter className={direction === "rtl" ? "flex-row-reverse gap-3" : "gap-3"}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="min-h-11"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="min-h-11"
                disabled={createCampaignMutation.isPending}
              >
                {createCampaignMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                {language === "ar" ? "حفظ الحملة" : "Save campaign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostLoginGate;
