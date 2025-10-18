import { useEffect } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
 import "@/components/layout/i18n";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  
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
        </motion.div>
          <Outlet />
          </div>
          </AuroraBackground>
  );
};
