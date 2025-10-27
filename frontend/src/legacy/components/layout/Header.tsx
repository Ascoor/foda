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
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { useAuth } from "@shared/contexts/AuthContext";
import { useLanguage } from "@shared/contexts/LanguageContext";
import { useNotifications } from "@shared/contexts/NotificationContext";
import { NotificationDrawer } from "@legacy/components/notifications/NotificationDrawer";
import { useTheme } from "@shared/contexts/ThemeContext";
import { useWindowSize } from "@shared/hooks/useWindowSize";
import { cn } from "@shared/lib/utils";
import { notifyNavClick, findRouteMatch } from "@/nav/nav.map";
import { useNavTree, useNavigationContext } from "@/nav/useNavigationContext";
import type { NavNode } from "@/nav/nav.schema";

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 160,
  damping: 22,
} as const;

const flattenNavNodes = (nodes: NavNode[]): NavNode[] => {
  const acc: NavNode[] = [];
  const walk = (list: NavNode[]) => {
    list.forEach((node) => {
      if (node.path) {
        acc.push(node);
      }
      if (node.children) {
        walk(node.children as NavNode[]);
      }
    });
  };
  walk(nodes);
  return acc;
};

const collectAncestorIds = (node: NavNode | undefined | null): string[] => {
  const ids: string[] = [];
  let current = node?.parent;
  while (current) {
    ids.push(current.id);
    current = current.parent ?? undefined;
  }
  return ids;
};

interface HeaderProps {
  onToggleSidebar?: () => void;
  variant?: "dashboard" | "public";
}

export const Header = ({
  onToggleSidebar,
  variant = "dashboard",
}: HeaderProps) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction } = useLanguage();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const navContext = useNavigationContext();
  const topNavTree = useNavTree("top");
  const location = useLocation();

  const isMobile = width < 768;
  const [now, setNow] = useState(new Date());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const topNavItems = useMemo(() => flattenNavNodes(topNavTree), [topNavTree]);
  const activeMatch = useMemo(
    () => findRouteMatch(location.pathname, navContext),
    [location.pathname, navContext],
  );
  const activeTopIds = useMemo(() => {
    if (!activeMatch) return new Set<string>();
    const chain = [activeMatch.id, ...collectAncestorIds(activeMatch.node)];
    return new Set(chain.filter(Boolean) as string[]);
  }, [activeMatch]);

  // ✅ ضبط اتجاه الصفحة ديناميكياً (RTL / LTR)
  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  // ✅ تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
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

  // ✅ الإشعارات
  let unreadCount = 0;
  let openNotificationsDrawer: (() => void) | undefined;
  try {
    const notifications = useNotifications();
    unreadCount = notifications.unreadCount;
    openNotificationsDrawer = () => notifications.setDrawerOpen(true);
  } catch {
    unreadCount = 0;
  }

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

  // ✅ الأزرار (ثيم + لغة)
  const themeToggle = (
    <Button
      key="theme"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={language === "ar" ? "تبديل الثيم" : "Toggle theme"}
      className={cn(
        "rounded-full p-0.5 transition-all hover:scale-105",
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
      aria-label={language === "ar" ? "تبديل اللغة" : "Toggle language"}
      className={cn(
        "rounded-full p-0.5 transition-all hover:scale-105",
        surfaceButtonClass,
      )}
    >
      <Globe
        className={cn(
          "h-5 w-5",
          language === "ar"
            ? "text-[hsl(var(--accent))]"
            : "text-[hsl(var(--primary))]",
        )}
      />
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
          "rounded-full p-0.5 transition-all hover:scale-105",
          surfaceButtonClass,
        )}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-1 right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white shadow-md"
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
              "rounded-full p-0.5 transition-all hover:scale-105",
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
    ) : null;

  const loginControl =
    variant !== "dashboard" && !isAuthenticated ? (
      <Button
        key="login"
        asChild
        className={cn("rounded-full px-5 font-semibold", surfaceButtonClass)}
      >
        <Link to="/auth/login">
          {language === "ar" ? "تسجيل الدخول" : "Sign in"}
        </Link>
      </Button>
    ) : null;

  // ✅ عكس ترتيب الأزرار حسب الاتجاه
  const controlsBase = [
    userMenu,
    notificationsToggle,
    themeToggle,
    languageToggle,
    loginControl,
  ].filter(Boolean) as JSX.Element[];

  const controls = direction === "rtl" ? controlsBase.reverse() : controlsBase;
  const brandLabel = t("navigation.dashboard", { defaultValue: language === "ar" ? "لوحة التحكم" : "Dashboard" });
  return (
    <>
      <motion.header
        layout
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        dir={direction}
        className="relative mx-auto mt-8 flex w-[94%] max-w-6xl items-center justify-between rounded-full border border-white/20 bg-white/40 px-6 py-4 shadow-[0_20px_60px_rgba(59,130,246,0.25)] backdrop-blur-2xl dark:bg-slate-900/50 dark:shadow-[0_20px_60px_rgba(76,29,149,0.35)]"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-800 dark:bg-indigo-500/30 dark:text-indigo-100">
            <Flame className="size-5" />
          </div>
        </div>

        <div
          className={cn(
            "flex flex-1 items-center gap-3",
            variant === "dashboard" ? "justify-center" : "justify-end",
          )}
        >
          {isMobile && onToggleSidebar && variant === "dashboard" && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                language === "ar" ? "القائمة الجانبية" : "Open sidebar"
              }
              className={cn("rounded-2xl p-0.5 shadow-sm", surfaceButtonClass)}
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
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
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Vote className="h-5 w-5" />
            </motion.span>
            <div className="hidden min-w-[9rem] flex-col text-xs font-medium text-muted-foreground sm:flex">
              <span className="text-sm font-semibold tracking-wide text-foreground">
                {brandLabel}
              </span>
              <span>{formattedDate}</span>
            </div>
          </motion.div>

          {variant === "dashboard" && topNavItems.length > 0 && (
            <nav
              aria-label={t("navigation.main")}
              className={cn(
                "hidden max-w-md flex-1 items-center gap-1 overflow-x-auto rounded-full border px-2 py-1 text-sm shadow-inner backdrop-blur",
                theme === "dark"
                  ? "border-white/10 bg-slate-900/40"
                  : "border-white/30 bg-white/40",
                "md:flex",
              )}
            >
              {topNavItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path ?? "#"}
                  end={item.exact}
                  onClick={() => notifyNavClick(item.id, item.path, navContext, "top")}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]",
                      isActive || activeTopIds.has(item.id)
                        ? "bg-[hsla(var(--primary)/0.18)] text-[hsl(var(--primary))]"
                        : "text-muted-foreground hover:bg-[hsla(var(--primary)/0.08)] hover:text-foreground",
                    )
                  }
                >
                  {t(item.i18nKey)}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* 🟢 عناصر التحكم */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isMobile && variant === "dashboard" && (
            <motion.div
              key="clock"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden text-right sm:flex sm:flex-col"
            >
              <span className="font-mono text-base font-semibold tracking-tight text-foreground">
                {formattedTime}
              </span>
              <span className="text-xs text-muted-foreground">
                {language === "ar" ? "التوقيت المحلي" : "Local time"}
              </span>
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

        <NotificationDrawer />
      </motion.header>
    </>
  );
};
