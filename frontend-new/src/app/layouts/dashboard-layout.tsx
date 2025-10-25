import { useMemo } from "react";
import { Sidebar } from "@shared/ui/sidebar";
import { Header } from "@shared/ui/header";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { motionTransitions } from "@/theme/motion";
import { useLanguage } from "@shared/hooks";

export const DashboardLayout = () => {
  const location = useLocation();
  const { direction } = useLanguage();

  const pageVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 12, x: direction === "rtl" ? -12 : 12 },
      animate: { opacity: 1, y: 0, x: 0 },
      exit: { opacity: 0, y: -8, x: direction === "rtl" ? 12 : -12 },
    }),
    [direction],
  );

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-95"
        style={{
          backgroundImage: "var(--shell-outer-gradient-1), var(--shell-outer-gradient-2)",
          backgroundBlendMode: "screen",
        }}
      />
      <Sidebar />
      <div className="relative flex flex-1 flex-col">
        <Header />
        <main className="relative flex-1 overflow-y-auto px-6 pb-10 pt-8">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage: "var(--shell-inner-gradient-1), var(--shell-inner-gradient-2)",
              backgroundBlendMode: "soft-light",
            }}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={pageVariants.initial}
              animate={pageVariants.animate}
              exit={pageVariants.exit}
              transition={motionTransitions.page}
              className="relative z-10 flex min-h-full flex-col gap-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
