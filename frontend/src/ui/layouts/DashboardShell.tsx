import { ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Sidebar } from "@/infrastructure/shared/layout/Sidebar";
import { Header } from "@/features/legacy/components/layout/Header";
import { DashboardBreadcrumbs } from "@/features/app/dashboard/layout/DashboardBreadcrumbs";
import { useNavBreadcrumbs } from "@/routing/nav/useNavigationContext";
import { useWindowSize } from "@/infrastructure/shared/hooks/useWindowSize";
import { cn } from "@/infrastructure/shared/lib/utils";
import { dashboardTokens } from "@/infrastructure/theme//tokens";
import { navConfig } from "@/routing/nav/nav.config";
import { AuroraBackground } from "@/features/modules/marketing/components/ui/AuroraBackground";

const DESKTOP_BREAKPOINT = 1024;

interface DashboardShellProps {
  children?: ReactNode;
  toolbar?: ReactNode;
}

export const DashboardShell = ({ children, toolbar }: DashboardShellProps) => {
  const { width } = useWindowSize();
  const { t } = useTranslation();
  const breadcrumbs = useNavBreadcrumbs();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const sidebarElement = useMemo(() => {
    if (isDesktop) {
      return (
        <Sidebar isOpen={sidebarOpen} onToggleCollapse={toggleSidebar} />
      );
    }

    return (
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.button
              type="button"
              aria-label={t("navigation.toggleSidebar", { defaultValue: "Toggle sidebar" })}
              className="fixed inset-0 z-20 bg-black/25 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
            <Sidebar isOpen isMobile onToggleCollapse={toggleSidebar} />
          </>
        )}
      </AnimatePresence>
    );
  }, [isDesktop, sidebarOpen, t, toggleSidebar]);

  return (
    <AuroraBackground>
      <div
        className="relative flex min-h-screen flex-col gap-6 pb-16"
        style={{ paddingInline: dashboardTokens.sidebarPadding }}
      >
        <Header onToggleSidebar={toggleSidebar} />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 gap-6 px-3 md:px-0">
          {sidebarElement}

          <motion.main
            layout
            className={cn(
              "relative z-10 flex-1 rounded-[32px] border border-white/20 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70",
              "space-y-6",
            )}
          >
            {breadcrumbs.length > 0 && (
              <div className="flex flex-col gap-4 border-b border-white/30 pb-4 dark:border-white/10">
                <DashboardBreadcrumbs />
                {toolbar && <div className="flex flex-wrap items-center gap-3">{toolbar}</div>}
              </div>
            )}

            {!breadcrumbs.length && toolbar && (
              <div className="flex flex-wrap items-center gap-3 border-b border-white/30 pb-4 dark:border-white/10">
                {toolbar}
              </div>
            )}

            <div className="flex-1">
              {children ?? <Outlet />}
            </div>
          </motion.main>
        </div>

        <footer className="mx-auto w-full max-w-6xl rounded-3xl border border-white/20 bg-white/30 px-6 py-4 text-xs text-muted-foreground backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Aurora Elections</span>
            <span>
              {t("navigation.main")}
              {": v"}
              {navConfig.version}
            </span>
          </div>
        </footer>
      </div>
    </AuroraBackground>
  );
};

export default DashboardShell;
