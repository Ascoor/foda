import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

const DESKTOP_BREAKPOINT = 1024;
const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 90,
  damping: 20,
} as const;

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { direction } = useLanguage();
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const location = useLocation();

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isMobile = width < DESKTOP_BREAKPOINT;
  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 272;

  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
      return;
    }
    setCollapsed(false);
  }, [isMobile]);

  return (
    <motion.div
      dir={direction}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={SPRING_TRANSITION}
      className={cn(
        "relative min-h-screen w-full overflow-hidden transition-[background-color,color] duration-500 ease-in-out",
        "bg-[hsl(var(--background))] text-[hsl(var(--foreground))]",
      )}
      style={
        {
          "--layout-header-height": "4.25rem",
          "--layout-footer-height": "3.5rem",
          backgroundImage:
            theme === "light"
              ? "linear-gradient(135deg, hsla(var(--background) / 1), hsla(var(--background-secondary) / 1))"
              : "linear-gradient(135deg, hsla(var(--background) / 1), hsla(var(--background-secondary) / 0.92))",
        } as CSSProperties
      }
    >
      {/* 💫 الشريط الجانبي (ثابت ومتحرك بانسيابية) */}
      <Sidebar
        layoutId="app-sidebar"
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* 🌈 الطبقة الأمامية المتحركة (المحتوى + الهيدر + الفوتر) */}
      <motion.div
        className="relative z-10 flex min-h-screen w-full flex-col"
        style={{
          paddingInlineStart: direction === "ltr" ? sidebarWidth : 0,
          paddingInlineEnd: direction === "rtl" ? sidebarWidth : 0,
          transition:
            "padding-inline-start 0.3s ease, padding-inline-end 0.3s ease",
        }}
      >
        {/* 🔹 رأس الصفحة */}
        <motion.div
          layout
          transition={SPRING_TRANSITION}
          className="sticky top-0 z-50"
        >
          <Header
            layoutId="app-header"
            onToggleSidebar={() => setMobileSidebarOpen(true)}
          />
        </motion.div>

        {/* 📜 المحتوى */}
        <motion.main
          layout
          className="relative z-0 flex-1 overflow-y-auto min-h-0"
          transition={SPRING_TRANSITION}
          style={{
            scrollbarGutter: "stable both-edges",
          }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 pt-8 sm:px-6 sm:pt-10 lg:px-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={SPRING_TRANSITION}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>

        {/* 🧱 الفوتر */}
        <motion.div
          layout
          transition={SPRING_TRANSITION}
          className="relative z-10 mt-auto border-t border-[hsla(var(--border)/0.15)] backdrop-blur-sm"
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-10">
            <Footer />
          </div>
        </motion.div>
      </motion.div>

      {/* 🩵 تأثير تلاحم بصري بين الطبقات */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.03] to-transparent dark:via-[#E7B10A]/[0.05] transition-all duration-700" />
    </motion.div>
  );
};
