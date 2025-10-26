import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Globe,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  UserCircle,
  Vote,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 160,
  damping: 22,
} as const;

interface HeaderProps {
  layoutId?: string;
  onToggleSidebar?: () => void;
  variant?: "dashboard" | "public";
}

export const Header = ({ layoutId, onToggleSidebar, variant = "dashboard" }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction } = useLanguage();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isMobile = width < 768;
  const [now, setNow] = useState(() => new Date());
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  let unreadCount = 0;
  let openNotificationsDrawer: (() => void) | undefined;
  try {
    const notifications = useNotifications();
    unreadCount = notifications.unreadCount;
    openNotificationsDrawer = () => notifications.setDrawerOpen(true);
  } catch (error) {
    unreadCount = 0;
  }

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = useMemo(
    () =>
      now.toLocaleTimeString(language, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [language, now],
  );

  const formattedDate = useMemo(
    () =>
      now.toLocaleDateString(language, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [language, now],
  );

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

  const themeAriaLabel = language === "ar"
    ? theme === "light"
      ? "تفعيل الوضع الليلي"
      : "تفعيل الوضع الفاتح"
    : theme === "light"
      ? "Switch to dark mode"
      : "Switch to light mode";

  const languageAriaLabel = language === "ar" ? "تغيير اللغة" : "Toggle language";

  const themeToggle = (
    <Button
      key="theme"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={themeAriaLabel}
      className={cn(
        "relative rounded-full p-0.5 transition-all duration-300 hover:scale-[1.03]",
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
  );

  const languageToggle = (
    <Button
      key="language"
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={languageAriaLabel}
      className={cn(
        "relative rounded-full p-0.5 transition-all duration-300 hover:scale-[1.03]",
        surfaceButtonClass,
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center">
        <Globe
          className={cn(
            "h-5 w-5 transition-colors",
            language === "ar" ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--primary))]",
          )}
        />
      </span>
    </Button>
  );

  const notificationsToggle =
    variant === "dashboard" && isAuthenticated ? (
      <Button
        key="notifications"
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={() => openNotificationsDrawer?.()}
        className={cn(
          "relative rounded-full p-0.5 transition-all duration-300 hover:scale-[1.03]",
          surfaceButtonClass,
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center">
          <Bell className="h-5 w-5" />
        </span>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-1.5 right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white shadow-md"
          >
            {unreadCount}
          </motion.span>
        )}
      </Button>
    ) : null;

  const userMenu =
    variant === "dashboard" && isAuthenticated ? (
      <DropdownMenu key="user">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="User menu"
            className={cn(
              "relative rounded-full p-0.5 transition-all duration-300 hover:scale-[1.03]",
              surfaceButtonClass,
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center">
              <User className="h-5 w-5" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={direction === "rtl" ? "start" : "end"}
          side="bottom"
          sideOffset={12}
          className={cn(
            "min-w-[200px] rounded-3xl border p-2 shadow-xl backdrop-blur-lg",
            theme === "dark"
              ? "border-[hsla(var(--border)/0.2)] bg-[hsla(var(--color-surface)/0.9)]"
              : "border-[hsla(var(--border)/0.12)] bg-[hsla(var(--color-surface)/0.92)]",
          )}
        >
          <DropdownMenuItem className="flex items-center gap-2 rounded-2xl px-3 py-2">
            <UserCircle className="h-4 w-4" />
            {user?.name ?? (language === "ar" ? "الملف الشخصي" : "Profile")}
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 rounded-2xl px-3 py-2">
            <Settings className="h-4 w-4" />
            {language === "ar" ? "الإعدادات" : "Settings"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-destructive"
            disabled={isLoggingOut}
            onSelect={(event) => {
              event.preventDefault();
              if (!isAuthenticated) return;
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
    ) : null;

  const loginControl =
    variant !== "dashboard" && !isAuthenticated ? (
      <Button
        key="login"
        asChild
        className={cn("rounded-full px-5 font-semibold", surfaceButtonClass)}
      >
        <Link to="/auth/login">{language === "ar" ? "تسجيل الدخول" : "Sign in"}</Link>
      </Button>
    ) : null;

  const controls = [userMenu, notificationsToggle, themeToggle, languageToggle, loginControl].filter(
    Boolean,
  ) as JSX.Element[];

  const containerHeight = isMobile ? 64 : isHovered ? 88 : 72;
  const brandLabel = language === "ar" ? "لوحة التحكم" : "Dashboard";

  return (
    <motion.header
      layoutId={layoutId}
      dir={direction}
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={SPRING_TRANSITION}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent/20",
        "px-2 pb-3 pt-2 sm:px-4",
        "[--glass-bg:linear-gradient(135deg,hsla(var(--card)/0.72),hsla(var(--card)/0.6))]",
      )}
    >

      <motion.div
        animate={{ height: containerHeight }}
        transition={SPRING_TRANSITION}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={cn(
          "relative mx-auto flex w-full max-w-[1480px] items-center justify-between gap-4 overflow-hidden rounded-[30px] border",
          theme === "dark"
            ? "border-[hsla(var(--border)/0.25)]"
            : "border-[hsla(var(--border)/0.15)]",
        )}
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
          boxShadow:
            theme === "dark"
              ? "0 20px 60px hsla(var(--primary)/0.18)"
              : "0 18px 45px hsla(var(--primary)/0.12)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-80 dark:opacity-40" />
          <div className="absolute -bottom-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        </div>

        <div
          className={cn(
            "relative z-10 flex h-full flex-1 items-center justify-between gap-4 px-4",
            direction === "rtl" ? "flex-row-reverse" : "flex-row",
          )}
        >
          <div className="flex items-center gap-3">
            {isMobile && onToggleSidebar && variant === "dashboard" && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={language === "ar" ? "فتح القائمة الجانبية" : "Open sidebar"}
                className={cn("rounded-2xl p-0.5 shadow-sm", surfaceButtonClass)}
                onClick={onToggleSidebar}
              >
                <span className="flex h-10 w-10 items-center justify-center">
                  <Menu className="h-5 w-5" />
                </span>
              </Button>
            )}

            <motion.div
              layout
              transition={SPRING_TRANSITION}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2",
                theme === "dark"
                  ? "bg-[hsla(var(--surface-secondary)/0.3)]"
                  : "bg-[hsla(var(--surface)/0.45)]",
              )}
            >
              <motion.span
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/0.85)] to-[hsl(var(--accent)/0.75)] text-[hsl(var(--primary-foreground))] shadow-lg"
                animate={{ rotate: isHovered ? 6 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <Vote className="h-5 w-5" />
              </motion.span>
              <div className="hidden min-w-[9rem] flex-col text-xs font-medium text-muted-foreground sm:flex">
                <span className="text-sm font-semibold tracking-wide text-foreground">{brandLabel}</span>
                <span>{formattedDate}</span>
              </div>
            </motion.div>
          </div>

          {variant === "dashboard" && !isMobile && (
            <motion.div
              className="relative hidden flex-1 items-center lg:flex"
              animate={{ width: isHovered ? "100%" : "60%", opacity: isHovered ? 1 : 0.92 }}
              transition={SPRING_TRANSITION}
            >
              <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <input
                type="search"
                placeholder={language === "ar" ? "ابحث عبر التقارير والفرق" : "Search reports, teams..."}
                className={cn(
                  "h-11 w-full rounded-[20px] border px-10 text-sm font-medium outline-none transition",
                  "border-[hsla(var(--border)/0.18)] bg-[hsla(var(--surface)/0.55)]",
                  "focus:border-[hsla(var(--primary)/0.45)] focus:ring-2 focus:ring-[hsla(var(--primary)/0.35)]",
                  direction === "rtl" && "text-right",
                )}
              />
            </motion.div>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {variant === "dashboard" && !isMobile && (
              <motion.div
                key="clock"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="hidden text-right sm:flex sm:flex-col"
              >
                <span className="font-mono text-base font-semibold tracking-tight text-foreground">
                  {formattedTime}
                </span>
                <span className="text-xs text-muted-foreground">{language === "ar" ? "التوقيت المحلي" : "Local time"}</span>
              </motion.div>
            )}
            <AnimatePresence initial={false} mode="popLayout">
              {controls.map((control, index) => (
                <motion.div
                  key={control.key ?? index}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {control}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};
