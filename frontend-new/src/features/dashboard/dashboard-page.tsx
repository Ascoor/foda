import { motion } from "framer-motion";
import { Users, PhoneCall, HandCoins, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatCard, NotificationList } from "@shared/ui";
import { useAuth } from "@shared/hooks";
import { ActivityChart } from "@features/dashboard/components/activity-chart";
import { CampaignMap } from "@features/dashboard/components/campaign-map";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation("dashboard");

  return (
    <motion.div
      {...pageMotion}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <section className="space-y-2 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">
          {t("welcome", { name: user?.name ?? "" })}
        </h1>
        <p className="text-sm text-muted-foreground">{t("overview")}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label={t("stats.voterReach")} value="82K" change="+5%" />
        <StatCard icon={PhoneCall} label={t("stats.dailyCalls")} value="1.2K" change="+12%" />
        <StatCard icon={HandCoins} label={t("stats.donations")} value="$48K" change="+8%" />
        <StatCard icon={Calendar} label={t("stats.events")} value="18" change="+2 upcoming" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <NotificationList />
      </section>

      <CampaignMap />
    </motion.div>
  );
};
