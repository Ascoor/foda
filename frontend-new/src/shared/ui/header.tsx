import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { cn } from "@shared/lib/utils";
import { useLanguage } from "@shared/hooks";
import { Button } from "@shared/ui/button";
import { LanguageToggle } from "@shared/ui/language-toggle";
import { ThemeToggle } from "@shared/ui/theme-toggle";
import { UserMenu } from "@shared/ui/user-menu";
import { sidebarNavItems } from "@shared/ui/sidebar";

const headerSpring = { type: "spring", stiffness: 240, damping: 30 } as const;

export const Header = () => {
  const { t } = useTranslation("common");
  const { language } = useLanguage();
  const location = useLocation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const timeLabel = useMemo(
    () =>
      now.toLocaleTimeString(language, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [language, now],
  );

  const dateLabel = useMemo(
    () =>
      now.toLocaleDateString(language, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    [language, now],
  );

  const activeNav = useMemo(() => {
    const trimmed = location.pathname.replace(/\/$/, "");
    const currentPath = trimmed === "" ? "/" : trimmed;
    return sidebarNavItems.find((item) => {
      if (item.path === "/dashboard") {
        return currentPath === "/dashboard";
      }
      return currentPath.startsWith(item.path);
    });
  }, [location.pathname]);

  const title = activeNav ? t(activeNav.labelKey) : t("appName");
  const notifications = 3;

  return (
    <motion.header
      layout
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={headerSpring}
      className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3">
          <motion.div
            layout
            transition={headerSpring}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary"
          >
            <span className="text-base font-semibold">CC</span>
          </motion.div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              {t("appName")}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-semibold text-foreground"
              >
                {title}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={timeLabel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="hidden min-w-[120px] flex-col rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-right text-xs font-medium text-muted-foreground shadow-sm sm:flex"
            >
              <span className="text-foreground">{timeLabel}</span>
              <span>{dateLabel}</span>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            aria-label={t("notifications")}
            className="relative rounded-full border border-border/60 bg-background/70 text-muted-foreground transition hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground shadow-sm",
                )}
              >
                {notifications}
              </motion.span>
            )}
          </Button>

          <LanguageToggle />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
};
