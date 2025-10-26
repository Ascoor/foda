import { motion } from "framer-motion";
import { TrendingUp, Users, Zap } from "lucide-react";
import { AreaChartCard } from "./charts/AreaChart";
import { BarChartCard } from "./charts/BarChart";
import { LineChartCard } from "./charts/LineChart";
import { PieChartCard } from "./charts/PieChart";
import { GlassCard } from "./GlassCard";
import { MapSection } from "./MapSection";

const overviewCards = [
  {
    title: "نسبة المشاركة",
    value: "68.4%",
    change: "+5.3%",
    icon: TrendingUp,
    gradient: "from-emerald-400/80 to-cyan-400/70",
  },
  {
    title: "الناخبون المسجلون",
    value: "1.2M",
    change: "+18k",
    icon: Users,
    gradient: "from-cyan-400/80 to-indigo-400/70",
  },
  {
    title: "التفاعل المباشر",
    value: "92k",
    change: "+12%",
    icon: Zap,
    gradient: "from-purple-400/80 to-pink-400/70",
  },
];

export const DashboardContent = () => (
  <motion.main layout className="relative flex-1 space-y-8">
    <section
      id="analytics"
      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {overviewCards.map(({ title, value, change, icon: Icon, gradient }) => (
        <GlassCard key={title} className="overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                {title}
              </p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {value}
              </h3>
              <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm dark:bg-slate-800/60 dark:text-emerald-300">
                {change}
              </span>
            </div>
            <div
              className={`rounded-3xl bg-gradient-to-br ${gradient} p-5 text-white shadow-[0_0_35px_rgba(59,130,246,0.35)]`}
            >
              <Icon className="size-8" />
            </div>
          </div>
        </GlassCard>
      ))}
    </section>
    <div id="layers" className="grid gap-6 md:grid-cols-2">
      <LineChartCard />
      <PieChartCard />
      <AreaChartCard />
      <BarChartCard />
    </div>
    <div id="reports" className="space-y-6">
      <MapSection />
    </div>
  </motion.main>
);
