import { useEffect } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/features/modules/marketing/components/ui/AuroraBackground";
import {
  Header,
  Sidebar,
  DashboardContent,
  FloatingActions,
  useFloatingExperienceStore,
} from "@/features/modules/marketing/components/layout";
import "@/features/modules/marketing/components/layout/i18n";

export const FloatingDashboard = () => {
  const { theme, language } = useFloatingExperienceStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "night");
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <AuroraBackground>
      <div className="relative flex min-h-screen flex-col gap-8 pb-24">
        <Header />
        <motion.div
          layout
          className={`relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-0 lg:flex-row ${language === "ar" ? "lg:flex-row-reverse" : ""}`}
        >
          <Sidebar />
          <DashboardContent />
        </motion.div>
        <FloatingActions />
      </div>
    </AuroraBackground>
  );
};

export default FloatingDashboard;
