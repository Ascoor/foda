import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftCircle,
  BarChart3,
  Database,
  LifeBuoy,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { campaignService } from "@/services/campaignService";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

const sectionMotion = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export const Dashboard = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { language, direction } = useLanguage();
  const navigate = useNavigate();

  if (!campaignId) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 text-foreground"
        dir={direction}
      >
        <Card className="glass-card border-white/10 bg-white/5 p-10 text-center">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl font-semibold">
              {language === "ar" ? "لم يتم تحديد حملة" : "No campaign selected"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "الرجاء اختيار حملة من البوابة" : "Please choose a campaign from the gate."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="glass" onClick={() => navigate("/app")}>
              <ArrowLeftCircle className="size-5" />
              {language === "ar" ? "العودة" : "Go back"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const query = useQuery({
    queryKey: ["campaign-metrics", campaignId],
    queryFn: () => campaignService.getMetricsSummary(campaignId ?? ""),
    enabled: Boolean(campaignId),
  });

  const headline = language === "ar" ? "لوحة التحكم" : "Dashboard";
  const subtitle = language === "ar"
    ? "نستعرض أدناه مؤشرات الأداء لحملتك"
    : "Here is the performance summary for your campaign";

  const emptyCopy = useMemo(
    () => ({
      title: language === "ar" ? "ابدأ من هنا" : "You're almost ready",
      description:
        language === "ar"
          ? "لم تُضف أي بيانات بعد. استخدم أحد الأزرار التالية للانطلاق"
          : "No activity yet. Use one of the actions below to kick things off.",
      actions: [
        {
          id: "import",
          label: language === "ar" ? "استيراد ناخبين" : "Import voters",
          icon: Database,
        },
        {
          id: "team",
          label: language === "ar" ? "إضافة فريق" : "Add team members",
          icon: UsersRound,
        },
        {
          id: "seed",
          label: language === "ar" ? "تشغيل Seeder تجريبي" : "Run sample seeder",
          icon: RefreshCw,
        },
      ],
    }),
    [language],
  );

  return (
    <div
      className="relative min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 text-foreground"
      dir={direction}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.14),_transparent_58%)]" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold md:text-4xl">{headline}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="glass"
              onClick={() => navigate("/app")}
              className="min-h-11"
            >
              <ArrowLeftCircle className="size-5" />
              {language === "ar" ? "تغيير الحملة" : "Switch campaign"}
            </Button>
            <Button variant="floating" className="min-h-11">
              <BarChart3 className="size-5" />
              {language === "ar" ? "عرض التقارير" : "View reports"}
            </Button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {query.isLoading ? (
            <motion.div key="loading" {...sectionMotion} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <Skeleton key={item} className="h-48 rounded-2xl bg-white/5" />
              ))}
            </motion.div>
          ) : query.isError ? (
            <motion.div
              key="error"
              {...sectionMotion}
              className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-red-500/40 bg-red-500/10 p-10 text-center"
            >
              <LifeBuoy className="size-12 text-red-300" />
              <div className="space-y-2">
                <p className="text-lg font-semibold">
                  {language === "ar" ? "حدث خطأ أثناء جلب المؤشرات" : "We ran into an issue"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "حاول إعادة المحاولة بعد قليل" : "Please try again shortly."}
                </p>
              </div>
              <Button onClick={() => query.refetch()} variant="glass" className="min-h-11">
                {language === "ar" ? "إعادة المحاولة" : "Retry"}
              </Button>
            </motion.div>
          ) : query.data?.hasData ? (
            <motion.div key="widgets" {...sectionMotion} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {query.data.widgets?.map((widget) => (
                <Card
                  key={String(widget.id)}
                  className="glass-card border-white/10 bg-white/10 shadow-[0_20px_45px_-20px_rgba(79,70,229,0.45)]"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {String(widget.title)}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {language === "ar" ? "نظرة سريعة" : "Quick view"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between">
                    <span className="text-4xl font-bold text-primary">
                      {typeof widget.value === "number" ? widget.value.toLocaleString() : widget.value}
                    </span>
                    {typeof widget.trend === "number" && (
                      <span
                        className={`text-sm font-semibold ${widget.trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {widget.trend >= 0 ? "+" : ""}
                        {widget.trend}%
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" {...sectionMotion}>
              <Card className="glass-card border-dashed border-white/20 bg-white/5 p-10 text-center">
                <CardHeader className="items-center text-center">
                  <CardTitle className="text-2xl font-semibold">{emptyCopy.title}</CardTitle>
                  <CardDescription>{emptyCopy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 md:flex-row md:justify-center">
                    {emptyCopy.actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Button key={action.id} variant="glass" className="min-h-12 flex-1">
                          <Icon className="size-5" />
                          {action.label}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
