import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut, Menu, Moon, Settings, Sun, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { notifyNavClick } from '@/nav/nav.map';
import { useNavigationContext } from '@/nav/useNavigationContext';
import { useAuth } from '@modules/auth';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useNotifications } from '@shared/contexts/NotificationContext';
import { useTheme } from '@shared/contexts/ThemeContext';
import { useWindowSize } from '@shared/hooks/useWindowSize';
import { NotificationDrawer } from '@legacy/components/notifications/NotificationDrawer';
import { Button } from '@shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';
import { cn } from '@shared/lib/utils';

interface HeaderProps {
  onToggleSidebar?: () => void;
  variant?: 'dashboard' | 'public';
}

export const Header = ({ onToggleSidebar, variant = 'dashboard' }: HeaderProps) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction } = useLanguage();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navContext = useNavigationContext();
  const isMobile = width < 768;
  const [now, setNow] = useState(new Date());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = useMemo(
    () =>
      now.toLocaleTimeString(language, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [language, now],
  );

  const formattedDate = useMemo(
    () =>
      now.toLocaleDateString(language, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    [language, now],
  );

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
    theme === 'dark'
      ? 'bg-[hsla(var(--color-surface)/0.32)] text-[hsl(var(--foreground))] hover:bg-[hsla(var(--color-surface)/0.45)]'
      : 'bg-[hsla(var(--color-surface)/0.85)] text-[hsl(var(--foreground))] hover:bg-[hsla(var(--color-surface)/0.95)] shadow-sm';

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const themeToggle = (
    <Button
      key="theme"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={language === 'ar' ? 'تبديل الثيم' : 'Toggle theme'}
      className={cn('rounded-full p-0.5 transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]', surfaceButtonClass)}
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
          {theme === 'light' ? (
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
      aria-label={language === 'ar' ? 'تبديل اللغة' : 'Toggle language'}
      className={cn('rounded-full p-0.5 transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]', surfaceButtonClass)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={language}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex h-10 w-10 items-center justify-center font-semibold"
        >
          {language === 'ar' ? 'AR' : 'EN'}
        </motion.span>
      </AnimatePresence>
    </Button>
  );

  const handleNotificationsClick = () => openNotificationsDrawer?.();

  const actionButtons = [themeToggle, languageToggle];

  return (
    <header className="relative z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {variant === 'dashboard' && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="inline-flex size-10 items-center justify-center rounded-2xl border border-border/40 bg-[hsla(var(--card)/0.8)] text-foreground transition hover:text-[hsl(var(--primary))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))] lg:hidden"
                aria-label={t('nav.toggleSidebar', { defaultValue: 'Toggle sidebar' })}
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2" aria-label={t('nav.dashboard')}>
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[hsla(var(--primary)/0.12)] text-[hsl(var(--primary))]">
                <UserCircle className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Aurora Election
                </p>
                <p className="text-base font-semibold text-foreground">
                  {t('nav.dashboard', { defaultValue: 'Dashboard' })}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {actionButtons}
            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-full p-0.5', surfaceButtonClass)}
              onClick={handleNotificationsClick}
              aria-label={t('nav.notifications', { defaultValue: 'Notifications' })}
            >
              <span className="relative flex items-center justify-center">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex size-4 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="inline-flex size-1 rounded-full bg-[hsl(var(--primary))]" />
            <span>{formattedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isMobile && <div className="hidden items-center gap-2 lg:flex">{actionButtons}</div>}

            <Button
              variant="ghost"
              size="icon"
              className={cn('rounded-full p-0.5 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]', surfaceButtonClass)}
              onClick={handleNotificationsClick}
              aria-label={t('nav.notifications', { defaultValue: 'Notifications' })}
            >
              <span className="relative flex items-center justify-center">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 rounded-2xl border border-border/40 bg-[hsla(var(--card)/0.8)] px-4 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]"
                  aria-label={language === 'ar' ? 'قائمة المستخدم' : 'User menu'}
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[hsla(var(--primary)/0.12)] text-[hsl(var(--primary))]">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  {!isMobile && (
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-foreground">{user?.fullName ?? 'Campaign Manager'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email ?? 'manager@campaign.eg'}</p>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={direction === 'rtl' ? 'start' : 'end'} className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2"
                    onClick={() => notifyNavClick('settings', '/settings', navContext, 'header-action')}
                  >
                    <Settings className="h-4 w-4" />
                    <span>{t('nav.settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <NotificationDrawer />
    </header>
  );
};

export default Header;
