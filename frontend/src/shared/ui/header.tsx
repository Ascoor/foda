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
import { useNotifications } from "@shared/contexts/NotificationContext";

const headerSpring = { type: "spring", stiffness: 240, damping: 30 } as const;

export const Header = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const location = useLocation();
  const [now, setNow] = useState(() => new Date());
  const { unreadCount } = useNotifications();

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

  const widgetStyle = {
    background: "var(--header-widget-background)",
    border: "1px solid var(--header-widget-border)",
    boxShadow: "var(--header-widget-shadow)",
    color: "var(--header-widget-foreground)",
    backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
  } as const;

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

  const title = activeNav ? t(`common.${activeNav.labelKey}`) : t("common.appName");
  return (
    <motion.header
      layout
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={headerSpring}
      className="sticky top-0 z-40 overflow-hidden border-b"
      style={{
        background: "linear-gradient(135deg, var(--header-glass-from), var(--header-glass-to))",
        borderColor: "var(--header-border)",
        boxShadow: "var(--header-glow)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute left-[18%] top-[-120px] h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--header-sheen)_0%,transparent_70%)] opacity-80 blur-3xl" />
        <span className="absolute right-[12%] top-[-90px] h-44 w-44 rounded-full bg-[radial-gradient(circle,var(--header-sheen)_0%,transparent_75%)] opacity-70 blur-2xl" />
        <span className="absolute inset-x-0 bottom-[-60px] h-40 bg-[radial-gradient(60%_40%_at_50%_100%,rgba(255,255,255,0.18),transparent_80%)]" />
      </div>
      <div className="flex items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3">
          <motion.div
            layout
            transition={headerSpring}
            className="relative flex items-center"
          >
            <span className="absolute inset-[-18px] -z-10 rounded-[var(--radius-xl)] bg-[radial-gradient(circle_at_top,var(--header-sheen),transparent_75%)] opacity-60 blur-2xl" />
            <img
              src="/assets/brand/foda-logo.svg"
              alt="Foda Elections | فوده مننا"
              className="h-11 w-auto drop-shadow-[0_18px_40px_rgba(59,130,246,0.35)]"
            />
          </motion.div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.38em] text-muted-foreground">
              {t("common.appName")}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-gradient-to-r from-[hsl(var(--header-title-from))] via-[hsl(var(--header-title-via))] to-[hsl(var(--header-title-to))] bg-clip-text text-xl font-semibold leading-tight text-transparent drop-shadow-[0_12px_36px_rgba(59,130,246,0.32)]"
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
              className="hidden min-w-[140px] flex-col rounded-[var(--radius-lg)] px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.28em] sm:flex"
              style={widgetStyle}
            >
              <span className="text-sm font-bold tracking-[0.22em]" style={{ color: "var(--header-widget-foreground)" }}>
                {timeLabel}
              </span>
              <span className="mt-0.5 text-[10px] font-medium opacity-80" style={{ color: "var(--header-widget-foreground)" }}>
                {dateLabel}
              </span>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="glass"
            size="icon"
            aria-label={t("common.notifications")}
            className="relative"
            style={widgetStyle}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(249,115,22,0.92),rgba(139,92,246,0.92))] px-1 text-[10px] font-semibold text-white shadow-[0_8px_16px_rgba(249,115,22,0.35)]",
                )}
              >
                {unreadCount}
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
