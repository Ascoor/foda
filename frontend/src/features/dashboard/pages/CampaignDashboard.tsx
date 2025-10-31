import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

import { useNewAuth as useAuth } from "@/shared/contexts/AuthContext";
import { useLanguage } from "@shared/contexts/LanguageContext";
import { safeArray } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";
import { useElections } from "@shared/api/elections.service";
import { fetchCampaign } from "@features/campaigns/api";
import { useCampaignsStore } from "@features/campaigns/store";
import { ElectionRibbon } from "@features/dashboard/components/ElectionRibbon";
import type { Campaign, Election } from "@/types";

const formatDate = (value?: string | null, locale: "ar" | "en" = "ar") => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Unable to format date", error);
    return value ?? "";
  }
};

const summarizeElection = (election: Election | undefined, language: "ar" | "en") => {
  if (!election) {
    return language === "ar"
      ? "لا توجد انتخابات مرتبطة حتى الآن"
      : "No linked elections yet.";
  }

  const phases = safeArray(election.phases);
  if (!phases.length) {
    return language === "ar"
      ? "لم يتم جدولة مراحل لهذه الانتخابات بعد"
      : "No phases have been scheduled for this election yet.";
  }

  const start = phases[0]?.starts_at;
  const end = phases[phases.length - 1]?.ends_at;
  const locale = language === "ar" ? "ar-EG" : "en-GB";

  if (!start || !end) {
    return language === "ar"
      ? "تأكد من إضافة نطاق زمني للانتخابات"
      : "Make sure to add a time range for this election.";
  }

  return language === "ar"
    ? `من ${new Date(start).toLocaleDateString(locale)} إلى ${new Date(end).toLocaleDateString(locale)}`
    : `From ${new Date(start).toLocaleDateString(locale)} to ${new Date(end).toLocaleDateString(locale)}`;
};

export const CampaignDashboard = () => {
  const navigate = useNavigate();
  const params = useParams<Record<string, string | undefined>>();
  const campaignId = params.campaignId ?? params.id ?? "";
  const routeElectionId = params.electionId ?? params.eid ?? "";
  const { language } = useLanguage();
  const { signOut } = useAuth();
  const { activeElectionId, setActiveCampaign, setActiveElection } = useCampaignsStore();

  useEffect(() => {
    if (!campaignId) {
      navigate("/campaigns", { replace: true });
    }
  }, [campaignId, navigate]);

  useEffect(() => {
    if (campaignId) {
      setActiveCampaign(campaignId);
    }
  }, [campaignId, setActiveCampaign]);

  useEffect(() => {
    if (routeElectionId) {
      setActiveElection(routeElectionId);
    }
  }, [routeElectionId, setActiveElection]);

  const {
    data: campaign,
    isLoading: isCampaignLoading,
    isError,
  } = useQuery<Campaign>({
    queryKey: ["campaign", campaignId],
    queryFn: () => fetchCampaign(campaignId),
    enabled: !!campaignId,
  });

  const {
    data: electionsData,
  } = useElections(campaignId);

  const elections = useMemo(() => safeArray(electionsData), [electionsData]);
  const fallbackElectionId = elections[0]?.id?.toString();
  const effectiveElectionId =
    routeElectionId || activeElectionId || fallbackElectionId || null;

  const activeElection = useMemo(
    () =>
      elections.find(
        (election) => election.id?.toString() === effectiveElectionId?.toString(),
      ),
    [elections, effectiveElectionId],
  );

  useEffect(() => {
    if (!campaignId || !elections.length) {
      return;
    }

    if (!routeElectionId) {
      const targetElectionId = activeElectionId ?? elections[0]?.id?.toString();
      if (!targetElectionId) {
        return;
      }

      setActiveElection(targetElectionId);
      navigate(`/c/${campaignId}/e/${targetElectionId}/dashboard`, { replace: true });
    }
  }, [
    activeElectionId,
    campaignId,
    elections,
    navigate,
    routeElectionId,
    setActiveElection,
  ]);

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 rounded-3xl border border-destructive/20 bg-destructive/10 p-10 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-destructive">
            {language === "ar" ? "تعذر تحميل الحملة" : "Unable to load campaign"}
          </h2>
          <Button onClick={() => navigate("/campaigns")}>
            {language === "ar" ? "العودة" : "Go back"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="glass-button inline-flex items-center gap-2"
              onClick={() => navigate("/campaigns")}
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "ar" ? "العودة للحملات" : "Back to campaigns"}
            </Button>
            {isCampaignLoading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">
                  {campaign?.name}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  {campaign?.description ??
                    (language === "ar"
                      ? "تتبع أداء الحملة واتخذ قرارات قائمة على البيانات"
                      : "Track campaign performance and make data-informed decisions.")}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={signOut} className="glass-button">
              {language === "ar" ? "تسجيل الخروج" : "Sign out"}
            </Button>
          </div>
        </div>

        <ElectionRibbon campaignId={campaignId} activeElectionId={effectiveElectionId} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ar" ? "المناطق" : "Geo areas"}
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaign?.default_geo_scope ?? (language === "ar" ? "غير محدد" : "Not set")}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "النطاق الجغرافي الحالي" : "Current geographic scope"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ar" ? "الفريق" : "Team"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "المتطوعون النشطون" : "Active volunteers"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ar" ? "الحملات الفرعية" : "Sub campaigns"}
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "قيد التنفيذ" : "Currently running"}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "ar" ? "الجدول" : "Timeline"}
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDate(campaign?.created_at, language)}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "تاريخ إنشاء الحملة" : "Campaign creation date"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              {language === "ar" ? "ملخص الانتخاب" : "Election summary"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
              <h3 className="text-base font-semibold text-foreground">
                {activeElection?.name ??
                  (language === "ar" ? "انتخاب غير محدد" : "Election not selected")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {summarizeElection(activeElection, language)}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <h4 className="text-sm font-semibold text-foreground">
                  {language === "ar" ? "بداية أول مرحلة" : "First phase starts"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(activeElection?.phases?.[0]?.starts_at, language) ||
                    (language === "ar" ? "غير محدد" : "Not specified")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/40 p-4">
                <h4 className="text-sm font-semibold text-foreground">
                  {language === "ar" ? "نهاية آخر مرحلة" : "Last phase ends"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(
                    activeElection?.phases?.[activeElection?.phases.length - 1]?.ends_at,
                    language,
                  ) || (language === "ar" ? "غير محدد" : "Not specified")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDashboard;
