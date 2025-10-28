import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu';
import { useAuth } from '@modules/auth';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useNotifications } from '@shared/contexts/NotificationContext';
import { NotificationDrawer } from '@legacy/components/notifications/NotificationDrawer';
import { useTheme } from '@shared/contexts/ThemeContext';
import { useWindowSize } from '@shared/hooks/useWindowSize';
import { cn } from '@shared/lib/utils';
import { notifyNavClick } from '@/nav/nav.map';
import { useActiveNavIds, useNavTree, useNavigationContext } from '@/nav/useNavigationContext';
import type { NavNode } from '@/nav/nav.schema';

const SPRING_TRANSITION = {
  type: 'spring',
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
  const topNavTree = useNavTree('top');
  const activeIds = useActiveNavIds();
  const isMobile = width < 768;
  const [now, setNow] = useState(new Date());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const topNavItems = useMemo(() => flattenNavNodes(topNavTree), [topNavTree]);

  const activeTopIds = useMemo(() => activeIds, [activeIds]);

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
      className={cn('rounded-full p-0.5 transition-all hover:scale-105', surfaceButtonClass)}
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
      className={cn('rounded-full p-0.5 transition-all hover:scale-105', surfaceButtonClass)}
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

  const quickActions = [
    {
      icon: Flame,
      label: language === 'ar' ? 'الفرص الساخنة' : 'Hot Leads',
      to: '/campaigns',
      description: language === 'ar' ? 'تابع أنشطة الحملات' : 'Track campaign momentum',
    },
    {
      icon: Vote,
      label: language === 'ar' ? 'نقاط التصويت' : 'Polling Stations',
      to: '/committees',
      description: language === 'ar' ? 'إدارة اللجان الانتخابية' : 'Manage election committees',
    },
    {
      icon: Globe,
      label: language === 'ar' ? 'الخريطة الحية' : 'Live Map',
      to: '/geo-areas',
      description: language === 'ar' ? 'مراقبة التغطية الميدانية' : 'Monitor field coverage',
    },
  ];

  const navItems = [themeToggle, languageToggle];

  const mobileMenuItems = topNavItems.map((item) => ({
    id: item.id,
    label: t(item.i18nKey),
    to: item.path ?? '#',
    active: activeTopIds.has(item.id),
  }));

  const desktopNav = (
    <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav.main')}>
      {topNavItems.map((item) => {
        const Icon = item.icon;
        const label = t(item.i18nKey);
        const isActive = activeTopIds.has(item.id);
        if (!item.path) return null;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            aria-label={label}
            className={({ isActive: routeActive }) =>
              cn(
                'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all',
                routeActive || isActive
                  ? 'bg-[hsla(var(--primary)/0.12)] text-[hsl(var(--primary))] shadow-sm'
                  : 'text-muted-foreground hover:bg-[hsla(var(--primary)/0.08)] hover:text-foreground',
              )
            }
            onClick={() => notifyNavClick(item.id, item.path, navContext, 'top')}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  const renderQuickActionCard = ({ icon: Icon, label, description, to }: (typeof quickActions)[number]) => (
    <NavLink
      key={label}
      to={to}
      className="glass-card flex items-start gap-3 rounded-2xl border border-border/40 p-4 transition hover:border-border"
      onClick={() => notifyNavClick(label, to, navContext, 'quick-actions')}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-[hsla(var(--primary)/0.12)] text-[hsl(var(--primary))]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </NavLink>
  );

  return (
    <header className="relative z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {variant === 'dashboard' && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="inline-flex size-10 items-center justify-center rounded-2xl border border-border/40 bg-[hsla(var(--card)/0.8)] text-foreground transition hover:text-[hsl(var(--primary))] lg:hidden"
                aria-label={t('nav.toggleSidebar', { defaultValue: 'Toggle sidebar' })}
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2" aria-label={t('nav.dashboard')}>
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[hsla(var(--primary)/0.12)] text-[hsl(var(--primary))]">
                <Vote className="h-5 w-5" />
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
            {navItems}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn('rounded-full p-0.5', surfaceButtonClass)}>
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={direction === 'rtl' ? 'start' : 'end'}>
                {mobileMenuItems.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <NavLink to={item.to} className={cn('flex items-center justify-between gap-3', item.active && 'text-[hsl(var(--primary))]')}>
                      <span>{item.label}</span>
                      {item.active && <span className="inline-flex size-2 rounded-full bg-[hsl(var(--primary))]" />}
                    </NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formattedDate}</span>
              <span className="inline-flex size-1 rounded-full bg-[hsl(var(--primary))]" />
              <span>{formattedTime}</span>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-2" aria-hidden>
                {navItems}
              </div>
            )}
          </div>

          {desktopNav}
        </div>
      </div>

      {variant === 'dashboard' && (
        <div className="border-t border-border/30 bg-background/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="relative gap-2 rounded-full border border-border/40 bg-[hsla(var(--card)/0.8)] px-3 py-2 text-sm font-medium"
                onClick={openNotificationsDrawer}
                aria-label={t('nav.notifications', { defaultValue: 'Notifications' })}
              >
                <Bell className="h-4 w-4" />
                <span>{t('nav.notifications', { defaultValue: 'Notifications' })}</span>
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {quickActions.map((action) => renderQuickActionCard(action))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 rounded-2xl border border-border/40 bg-[hsla(var(--card)/0.8)] px-4 py-2 text-left"
                >
                  <div className="flex size-10 items-center justify-center rounded-full bg-[hsla(var(--primary)/0.12)] text-[hsl(var(--primary))]">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-foreground">{user?.fullName ?? 'Campaign Manager'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email ?? 'manager@campaign.eg'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={direction === 'rtl' ? 'start' : 'end'} className="w-56">
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="flex items-center gap-2" onClick={() => notifyNavClick('settings', '/settings', navContext, 'top')}
                  >
                    <Settings className="h-4 w-4" />
                    <span>{t('nav.settings')}</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <NotificationDrawer />
    </header>
  );
};
