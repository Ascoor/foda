import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/use-window-size';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isRTL = direction === 'rtl';

  // 🕒 الساعة الرقمية الذكية
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = dateTime.toLocaleTimeString(language, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const formattedDate = dateTime.toLocaleDateString(language, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
      dir={direction}
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300',
        theme === 'dark'
          ? 'border-white/10 bg-[#0b1a2a]/90 text-white'
          : 'border-[#1C3F60]/10 bg-white/85 text-[#1C3F60]'
      )}
    >
      <div className="mx-auto flex h-[var(--layout-header-height)] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* ================== Left Section ================== */}
        <div
          className={cn(
            'flex items-center gap-4',
            isRTL ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          {/* Sidebar Toggle (mobile) */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl bg-white/10 p-2 text-white shadow-md hover:bg-white/20 dark:bg-[#1C3F60]/40 dark:hover:bg-[#1C3F60]/60"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}


        </div>
          {/* Logo */}
          <div
            className={cn(
              'flex items-center gap-2 font-semibold tracking-wide',
              isRTL && 'flex-row-reverse'
            )}
          >  
        {/* ================== Center Section (Clock) ================== */}
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
            'flex items-center gap-2 sm:gap-3',
            isRTL && 'flex-row-reverse'
          )}
        >
          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={toggleTheme}
            className={cn(
              'relative rounded-full p-2 transition-all hover:scale-105',
              theme === 'dark'
                ? 'bg-[#1C3F60]/40 text-white hover:bg-[#1C3F60]/60'
                : 'bg-white/70 text-[#1C3F60] hover:bg-white/90 shadow-sm'
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
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-400" />
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
              'rounded-full p-2 transition-all hover:scale-105',
              theme === 'dark'
                ? 'bg-[#1C3F60]/40 text-white hover:bg-[#1C3F60]/60'
                : 'bg-white/70 text-[#1C3F60] hover:bg-white/90 shadow-sm'
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
                {language === 'ar' ? (
                  <Globe className="h-5 w-5 text-[#E7B10A]" />
                ) : (
                  <Globe className="h-5 w-5 text-[#1C3F60]" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative rounded-full p-2 hover:scale-105 transition-all',
              theme === 'dark'
                ? 'bg-[#1C3F60]/40 text-white hover:bg-[#1C3F60]/60'
                : 'bg-white/70 text-[#1C3F60] hover:bg-white/90 shadow-sm'
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
                  'rounded-full p-2 hover:scale-105 transition-all',
                  theme === 'dark'
                    ? 'bg-[#1C3F60]/40 text-white hover:bg-[#1C3F60]/60'
                    : 'bg-white/70 text-[#1C3F60] hover:bg-white/90 shadow-sm'
                )}
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align={isRTL ? 'start' : 'end'}
              sideOffset={8}
              className={cn(
                'min-w-[180px] rounded-2xl border border-white/10 p-2 backdrop-blur-lg shadow-lg',
                theme === 'dark'
                  ? 'bg-[#0b1a2a]/95 text-white'
                  : 'bg-white/95 text-[#1C3F60]'
              )}
            >
              <DropdownMenuItem className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                {user?.name ?? (language === 'ar' ? 'الملف الشخصي' : 'Profile')}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {language === 'ar' ? 'الإعدادات' : 'Settings'}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};
