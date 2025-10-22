import { AnimatePresence, motion } from "framer-motion";
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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative mx-auto flex w-full max-w-xs flex-col overflow-hidden rounded-3xl bg-[color:var(--color-sidebar-bg)] text-[color:var(--color-text)] shadow-2xl ring-1 ring-black/5 transition-colors duration-300 dark:bg-[color:var(--color-sidebar-bg)] dark:ring-white/10 ${language === "ar" ? "lg:order-last" : ""}`}
    >
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5" />
      <div className="relative flex items-center justify-between px-6 pb-4 pt-6">
        <div>
          <p className="text-base font-bold">
            {language === "ar" ? "لوحة التحكم" : "Dashboard"}
          </p>
          <p className="text-xs opacity-70">
            {language === "ar" ? "نظرة شاملة للحملات" : "Insightful campaign view"}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-xl bg-[color:var(--color-hover)] px-4 py-2 text-xs font-semibold text-[color:var(--color-text)] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-95 dark:bg-white/10 dark:text-white"
        >
          {sidebarOpen
            ? language === "ar"
              ? "إخفاء"
              : "Hide"
            : language === "ar"
              ? "إظهار"
              : "Show"}
        </button>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {sidebarOpen ? (
          <motion.nav
            key="sidebar-nav"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative flex flex-1 flex-col gap-2 px-4 pb-6"
          >
            <ul className="space-y-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <motion.li
                  key={to}
                  whileHover={{ x: language === "ar" ? -6 : 6 }}
                >
                  <a
                    href={to}
                    className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--color-hover)] hover:shadow-lg hover:brightness-95 dark:hover:bg-white/10"
                  >
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-[color:var(--color-hover)] text-[color:var(--color-text)] shadow-inner dark:bg-white/10 dark:text-white">
                      <Icon className="size-4" />
                    </span>
                    <span>{label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div
              className="mt-auto rounded-2xl p-4 text-xs font-medium text-[color:var(--color-text)] shadow-inner dark:bg-white/5 dark:text-white"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-hover) 70%, transparent)",
              }}
            >
              {language === "ar"
                ? "استخدم الشريط الجانبي للانتقال السريع بين أقسام التحليلات"
                : "Use the sidebar to jump between analytics sections."}
            </div>
          </motion.nav>
        ) : (
          <motion.div
            key="sidebar-collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 items-center justify-center px-6 pb-6 text-center text-xs opacity-70"
          >
            {language === "ar"
              ? "تم إخفاء الشريط الجانبي — اضغط على الزر لإظهاره مرة أخرى"
              : "Sidebar hidden — tap the button to reveal it again."}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
