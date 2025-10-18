import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet } from "react-router-dom";

import { AuroraBackground } from "@/nextgen/components/ui/AuroraBackground";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/shared/layout/Sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWindowSize } from "@/hooks/useWindowSize";

const DESKTOP_BREAKPOINT = 1024;

export const MainLayout = () => {
  const { width } = useWindowSize();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const { theme } = useTheme();
  const { language, direction } = useLanguage();

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const layoutClassName = useMemo(
    () =>
      [
        "relative flex min-h-screen flex-col gap-2 pb-16",
        `theme-${theme}`,
        `lang-${language}`,
      ].join(" "),
    [language, theme],
  );

  return (
    <AuroraBackground>
      <div className={layoutClassName} dir={direction}>
        <Header onToggleSidebar={toggleSidebar} />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 md:px-0">
          {isDesktop ? (
            <Sidebar
              isOpen={sidebarOpen}
              onToggleCollapse={toggleSidebar}
            />
          ) : (
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  <motion.button
                    type="button"
                    aria-label="Close sidebar"
                    className="fixed inset-0 z-20 bg-black/25 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={toggleSidebar}
                  />
                  <Sidebar
                    isOpen
                    isMobile
                    onToggleCollapse={toggleSidebar}
                  />
                </>
              )}
            </AnimatePresence>
          )}

          <motion.main
            layout
            className="relative z-10 flex-1 pb-10 pt-6"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </AuroraBackground>
  );
};
