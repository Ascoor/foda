import { motion } from "framer-motion";
import { Activity, BarChart3, Layers3, MapPin } from "lucide-react";
import { useFloatingExperienceStore } from "./store";

const navItems = [
  { to: "#analytics", label: "تحليلات الأداء", icon: Activity },
  { to: "#layers", label: "طبقات البيانات", icon: Layers3 },
  { to: "#zones", label: "المناطق", icon: MapPin },
  { to: "#reports", label: "التقارير", icon: BarChart3 },
];

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, language } = useFloatingExperienceStore();

  return (
    <motion.aside
      layout
      initial={{ opacity: 0, x: language === "ar" ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`pointer-events-auto mx-auto mt-8 flex w-[94%] max-w-xs flex-col gap-5 rounded-3xl border border-white/15 bg-white/40 p-6 shadow-[0_20px_60px_rgba(45,212,191,0.25)] backdrop-blur-2xl dark:bg-slate-900/60 dark:shadow-[0_20px_70px_rgba(165,180,252,0.35)] ${language === "ar" ? "order-2" : ""}`}
    >
      <button
        onClick={toggleSidebar}
        className="self-end rounded-full border border-white/30 bg-white/30 px-4 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-white/50 dark:bg-slate-800/60 dark:text-slate-100"
      >
        {sidebarOpen
          ? language === "ar"
            ? "إخفاء"
            : "Hide"
          : language === "ar"
            ? "إظهار"
            : "Show"}
      </button>
      {sidebarOpen && (
        <nav className="space-y-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <motion.div
              key={to}
              whileHover={{ scale: 1.03, x: language === "ar" ? -6 : 6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/40 p-4 shadow-lg backdrop-blur-xl transition dark:bg-slate-900/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-emerald-200/15 to-indigo-300/20 opacity-0 transition group-hover:opacity-100" />
              <a
                href={to}
                className="relative flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-100"
              >
                <span className="flex size-10 items-center justify-center rounded-2xl bg-white/70 text-cyan-700 shadow-inner dark:bg-slate-800/80 dark:text-indigo-200">
                  <Icon className="size-4" />
                </span>
                <span>{label}</span>
              </a>
            </motion.div>
          ))}
        </nav>
      )}
    </motion.aside>
  );
};
