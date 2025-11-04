// Header.tsx — mobile: hide brand & smart icons, show sidebar toggle; single-row; no tabs
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Flame,
  Globe,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  UserCircle,
  Vote,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/infrastructure/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/infrastructure/shared/ui/dropdown-menu";
import { useAuth } from "@/infrastructure/shared/contexts/AuthContext";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { useNotifications } from "@/infrastructure/shared/contexts/NotificationContext";
import { NotificationDrawer } from "@/features/legacy/components/notifications/NotificationDrawer";
import { useTheme } from "@/infrastructure/shared/contexts/ThemeContext";
import { useWindowSize } from "@/infrastructure/shared/hooks/useWindowSize";
import { cn } from "@/infrastructure/shared/lib/utils";

/* ============ Animations ============ */
const SPRING = { type: "spring", stiffness: 160, damping: 22 } as const;

/* ============ Smart Date/Time Badge ============ */
function SmartDate({
  now,
  locale,
  dense = false,
  showIcon = true,
  className,
}: {
  now: Date;
  locale: string;
  dense?: boolean;
  showIcon?: boolean; // NEW: hide icon on mobile
  className?: string;
}) {
  const hour12 = useMemo(() => (locale?.startsWith("ar") ? true : undefined), [locale]);

  const time = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: dense ? undefined : "2-digit",
        hour12,
      }).format(now),
    [locale, now, hour12, dense],
  );

  const date = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: dense ? undefined : "long",
        month: "short",
        day: "numeric",
      }).format(now),
    [locale, now, dense],
  );

  return (
    <div
      className={cn(
        "glass-card group relative flex items-center gap-3 rounded-2xl",
        dense ? "px-2.5 py-1.5" : "px-3 py-2",
        "bg-[var(--cluster-bg)]/90 dark:bg-[var(--cluster-bg-dark)]/90",
        "shadow-[0_10px_30px_var(--shadow-layer-2)] dark:shadow-[0_12px_36px_var(--shadow-layer-2-dark)]",
        className,
      )}
      aria-label="Date & Time"
    >
      {showIcon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary)/0.85)] to-[hsl(var(--accent)/0.7)] text-[hsl(var(--primary-foreground))] shadow-elegant">
          <Vote className="h-4 w-4" />
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <span className={cn("truncate text-sm font-semibold text-foreground", dense && "text-[13px]")}>
          {time}
        </span>
        <span className={cn("truncate text-xs text-muted-foreground", dense && "text-[11px]")}>
          {date}
        </span>
      </div>

      {/* sweep highlight */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </span>
    </div>
  );
}

/* ============ Header (No Tabs) ============ */
export interface HeaderProps {
  onToggleSidebar?: () => void;
  variant?: "dashboard" | "public";
}

export const Header = ({ onToggleSidebar, variant = "dashboard" }: HeaderProps) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction } = useLanguage();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const notifications = useNotifications();

  const [now, setNow] = useState(() => new Date());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const unreadCount = notifications?.unreadCount ?? 0;
  const openNotifications = () => notifications?.setDrawerOpen?.(true);

  const surfaceButtonClass =
    theme === "dark"
      ? "bg-[hsla(var(--color-surface)/0.32)] text-[hsl(var(--foreground))] hover:bg-[hsla(var(--color-surface)/0.45)]"
      : "bg-[hsla(var(--color-surface)/0.85)] text-[hsl(var(--foreground))] hover:bg-[hsla(var(--color-surface)/0.95)] shadow-sm";

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.header
      layout
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      dir={direction}
      className={cn(
        "relative mx-auto mt-8 w-[94%] max-w-6xl",
        "glass rounded-3xl px-3 py-2 sm:px-6 sm:py-4",
        "shadow-[0_22px_70px_var(--shadow-layer-1)] dark:shadow-[0_26px_80px_var(--shadow-layer-1-dark)]",
      )}
    >
      {/* Mobile: single-row with horizontal scroll; Desktop: 3-col grid */}
      <div
        className={cn(
          "flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar",
          "md:grid md:grid-cols-[auto,1fr,auto] md:overflow-visible",
        )}
      >
        {/* Left: brand (hidden on mobile) + sidebar toggle (visible on mobile) */}
        <div className="shrink-0 flex items-center gap-3 md:gap-4">
          {/* brand icon: hide on mobile, show md+ */}
          <div className="hidden md:flex size-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-800 dark:bg-indigo-500/30 dark:text-indigo-100">
            <Flame className="size-5" />
          </div>

          {/* brand text: hidden on very small, show from xs+ */}
          <div className="hidden xs:flex sm:flex-col">
            <span className="text-sm font-semibold tracking-wide text-foreground">
              {t("navigation.dashboard", {
                defaultValue: language === "ar" ? "لوحة التحكم" : "Dashboard",
              })}
            </span>
            <span className="text-xs text-muted-foreground">
              {language === "ar" ? "إدارة ذكية للحملات" : "Smart campaign control"}
            </span>
          </div>

          {/* sidebar toggle: show on mobile only (md:hidden) */}
          {onToggleSidebar && variant === "dashboard" && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={language === "ar" ? "القائمة الجانبية" : "Open sidebar"}
              className={cn("glass-button rounded-2xl md:hidden", surfaceButtonClass)}
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center: Smart date/time (icon hidden on mobile) */}
        <motion.div
          layout
          transition={SPRING}
          className="flex-1 min-w-0 flex items-center justify-center"
        >
          <SmartDate now={now} locale={language} dense={isMobile} showIcon={!isMobile} />
        </motion.div>

        {/* Right: controls */}
        <div className="shrink-0 flex items-center justify-end gap-2 sm:gap-3">
          {variant === "dashboard" && isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              onClick={openNotifications}
              className={cn(
                "rounded-full p-0.5 transition-all hover:scale-105 glass-button",
                surfaceButtonClass,
                "relative",
              )}
            >
              <Bell className="h-5 w-5" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white shadow-md"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={language === "ar" ? "تبديل الثيم" : "Toggle theme"}
            className={cn(
              "rounded-full p-0.5 transition-all hover:scale-105 glass-button",
              surfaceButtonClass,
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex h-10 w-10 items-center justify-center"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-[hsl(var(--primary))]" />
                ) : (
                  <Sun className="h-5 w-5 text-[hsl(var(--accent))]" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label={language === "ar" ? "تبديل اللغة" : "Toggle language"}
            className={cn(
              "rounded-full p-0.5 transition-all hover:scale-105 glass-button",
              surfaceButtonClass,
            )}
          >
            <Globe className="h-5 w-5" />
          </Button>

          {variant === "dashboard" && isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="User menu"
                  className={cn(
                    "rounded-full p-0.5 transition-all hover:scale-105 glass-button",
                    surfaceButtonClass,
                  )}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={direction === "rtl" ? "start" : "end"}
                side="bottom"
                sideOffset={12}
                className={cn(
                  "min-w-[220px] rounded-2xl border p-2 shadow-2xl backdrop-blur-xl",
                  "bg-[var(--menu-bg)]/90 dark:bg-[var(--menu-bg-dark)]/90",
                )}
              >
                <DropdownMenuItem className="flex items-center gap-2 rounded-xl px-3 py-2">
                  <UserCircle className="h-4 w-4" />
                  {user?.name ?? (language === "ar" ? "الملف الشخصي" : "Profile")}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 rounded-xl px-3 py-2">
                  <Settings className="h-4 w-4" />
                  {language === "ar" ? "الإعدادات" : "Settings"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-destructive"
                  disabled={isLoggingOut}
                  onSelect={(e) => {
                    e.preventDefault();
                    void handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut
                    ? language === "ar"
                      ? "جاري تسجيل الخروج..."
                      : "Logging out..."
                    : language === "ar"
                    ? "تسجيل الخروج"
                    : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            variant !== "dashboard" && (
              <Button
                asChild
                className={cn("rounded-full px-3 py-2 font-semibold glass-button xs:px-4", surfaceButtonClass)}
              >
                <Link to="/auth/login">
                  <span className="hidden xs:inline">{language === "ar" ? "تسجيل الدخول" : "Sign in"}</span>
                  <User className="h-5 w-5 xs:ml-2 inline" />
                </Link>
              </Button>
            )
          )}
        </div>
      </div>

      {/* divider */}
      <div className="pointer-events-none mt-3 h-[1px] w-full rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />

      <NotificationDrawer />
    </motion.header>
  );
};

/* Optional global CSS (hide scrollbar):
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
*/
