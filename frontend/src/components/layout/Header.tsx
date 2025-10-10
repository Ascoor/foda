import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Bell,
  Globe,
  User,
  Menu,
  Vote,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useWindowSize } from "@/hooks/use-window-size";

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 90,
  damping: 20,
} as const;

interface HeaderProps {
  layoutId?: string;
  onToggleSidebar: () => void;
}

export const Header = ({ layoutId, onToggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isRTL = direction === "rtl";

  // 🕒 الساعة الرقمية الذكية
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = dateTime.toLocaleTimeString(language, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = dateTime.toLocaleDateString(language, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const surfaceControlClass =
    theme === "dark"
      ? "bg-[hsla(var(--color-surface)/0.45)] text-[hsl(var(--foreground))] hover:bg-[hsla(var(--color-surface)/0.65)]"
      : "bg-[hsla(var(--color-surface)/0.75)] text-[hsl(var(--foreground))] hover:bg-[hsla(var(--color-surface)/0.95)] shadow-sm";

  return (
    <motion.header
      layoutId={layoutId}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      dir={direction}
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300",
        theme === "dark"
          ? "border-[hsla(var(--border)/0.35)] bg-[hsla(var(--color-surface)/0.9)] text-[hsl(var(--foreground))]"
          : "border-[hsla(var(--border)/0.25)] bg-[hsla(var(--color-surface)/0.85)] text-[hsl(var(--foreground))]",
      )}
    >
      <div className="mx-auto flex h-[var(--layout-header-height)] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* ================== Left Section ================== */}
        <div
          className={cn(
            "flex items-center gap-4",
            isRTL ? "flex-row-reverse" : "flex-row",
          )}
        >
          {/* Sidebar Toggle (mobile) */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-2xl p-2 shadow-md transition-colors",
                surfaceControlClass,
              )}
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
        {/* ================== Center Section (Clock) ================== */}
        <div className="hidden sm:flex flex-col items-center  justify-center select-none text-center">
          <span className="text-[0.8rem] text-muted-foreground uppercase tracking-wide">
            {formattedDate}
          </span>
          <span className="font-mono text-lg font-semibold tracking-tight">
            {formattedTime}
          </span>
        </div>

        {/* ================== Right Section ================== */}
        <div
          className={cn(
            "flex items-center gap-2 sm:gap-3",
            isRTL && "flex-row-reverse",
          )}
        >
          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            onClick={toggleTheme}
            className={cn(
              "relative rounded-full p-2 transition-all hover:scale-105",
              surfaceControlClass,
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-[hsl(var(--primary))]" />
                ) : (
                  <Sun className="h-5 w-5 text-[hsl(var(--accent))]" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>

          {/* Language Switcher */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle language"
            onClick={toggleLanguage}
            className={cn(
              "rounded-full p-2 transition-all hover:scale-105",
              surfaceControlClass,
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={language}
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -180, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {language === "ar" ? (
                  <Globe className="h-5 w-5 text-[hsl(var(--accent))]" />
                ) : (
                  <Globe className="h-5 w-5 text-[hsl(var(--primary))]" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative rounded-full p-2 hover:scale-105 transition-all",
              surfaceControlClass,
            )}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white shadow-md">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full p-2 hover:scale-105 transition-all",
                  surfaceControlClass,
                )}
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align={isRTL ? "start" : "end"}
              sideOffset={8}
              className={cn(
                "min-w-[180px] rounded-2xl border p-2 backdrop-blur-lg shadow-lg",
                "border-[hsla(var(--border)/0.2)] text-[hsl(var(--foreground))]",
                theme === "dark"
                  ? "bg-[hsla(var(--color-surface)/0.92)]"
                  : "bg-[hsla(var(--color-surface)/0.97)]",
              )}
            >
              <DropdownMenuItem className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                {user?.name ?? (language === "ar" ? "الملف الشخصي" : "Profile")}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {language === "ar" ? "الإعدادات" : "Settings"}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                {language === "ar" ? "تسجيل الخروج" : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};
