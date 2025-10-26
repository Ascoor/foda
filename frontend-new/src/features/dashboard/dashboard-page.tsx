import { Header, Sidebar, StatCard, NotificationList } from "@/shared/ui";
import { useAuth } from "@/shared/hooks";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { CampaignMap } from "@/features/dashboard/components/campaign-map";
import { useTranslation } from "react-i18next";
import { Users, PhoneCall, HandCoins, Calendar } from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-white to-slate-100 dark:from-background-dark dark:via-slate-900 dark:to-slate-950">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 space-y-6 p-6">
          <section className="space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {t("welcome", { name: user?.name ?? "" })}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("overview")}
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Users}
              label={t("stats.voterReach")}
              value="82K"
              change="+5%"
            />
            <StatCard
              icon={PhoneCall}
              label={t("stats.dailyCalls")}
              value="1.2K"
              change="+12%"
            />
            <StatCard
              icon={HandCoins}
              label={t("stats.donations")}
              value="$48K"
              change="+8%"
            />
            <StatCard
              icon={Calendar}
              label={t("stats.events")}
              value="18"
              change="+2 upcoming"
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityChart />
            </div>
            <NotificationList />
          </section>

          <CampaignMap />
        </main>
      </div>
    </div>
  );
};
