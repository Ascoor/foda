import { useEffect } from "react";
import {
  Header,
  Sidebar,
  DashboardContent,
  FloatingActions,
  useFloatingExperienceStore,
} from "../components/layout";
import "../components/layout/i18n";

export const FloatingDashboard = () => {
  const { theme, language, toggleTheme } = useFloatingExperienceStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <button
        id="toggleDarkMode"
        type="button"
        onClick={toggleTheme}
        className="absolute right-4 top-4 z-50 inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg transition-transform duration-300 hover:scale-105 dark:bg-gray-700 dark:text-gray-100"
      >
        <span role="img" aria-hidden>
          🌓
        </span>
        {language === "ar" ? "تبديل الوضع" : "Toggle mode"}
      </button>
      <div className="flex min-h-screen flex-col gap-6 px-4 pb-24 pt-20 transition-all duration-300 lg:flex-row lg:px-10 lg:pt-12">
        <Sidebar />
        <main className="flex-1 space-y-8 rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-black/5 transition-colors duration-300 dark:bg-[color:var(--color-sidebar-bg)] dark:ring-white/10 lg:p-10">
          <Header />
          <DashboardContent />
        </main>
      </div>
      <FloatingActions />
    </div>
  );
};

export default FloatingDashboard;
