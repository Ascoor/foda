import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Vote,
  MapPin,
  Users,
  UserCheck,
  Crown,
  Shield,
  Heart,
  Eye,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/use-window-size';
import type { LucideIcon } from 'lucide-react';

interface NavigationItem {
  key: string;
  icon: LucideIcon;
  path: string;
  roles?: string[];
}

interface SidebarProps {
  isMobileSidebarOpen?: boolean;
  setMobileSidebarOpen?: (open: boolean) => void;
}

export const Sidebar = ({ isMobileSidebarOpen = false, setMobileSidebarOpen }: SidebarProps) => {
  const { language, direction, t } = useLanguage();
  const { user } = useAuth();
  const isRTL = direction === 'rtl';
  const location = useLocation();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [collapsed, setCollapsed] = useState(false);

  // Widths
  const sidebarWidth = collapsed ? 'var(--sidebar-width-collapsed, 5rem)' : 'var(--sidebar-width-expanded, 16rem)';
  const sidebarWidthMobile = 'min(80vw, var(--sidebar-width-expanded, 16rem))';

  const navigationItems: NavigationItem[] = useMemo(() => {
    const items: NavigationItem[] = [
      { key: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { key: 'elections', icon: Vote, path: '/elections', roles: ['Admin', 'FieldLead'] },
      { key: 'geo_areas', icon: MapPin, path: '/geo-areas', roles: ['Admin', 'FieldLead'] },
      { key: 'committees', icon: Users, path: '/committees', roles: ['Admin', 'FieldLead'] },
      { key: 'voters', icon: UserCheck, path: '/voters', roles: ['Admin', 'FieldLead'] },
      { key: 'candidates', icon: Crown, path: '/candidates', roles: ['Admin', 'FieldLead'] },
      { key: 'agents', icon: Shield, path: '/agents', roles: ['Admin', 'FieldLead'] },
      { key: 'volunteers', icon: Heart, path: '/volunteers', roles: ['Admin', 'FieldLead'] },
      { key: 'observations', icon: Eye, path: '/observations', roles: ['Admin', 'FieldLead', 'Agent'] },
      { key: 'campaigns', icon: Megaphone, path: '/campaigns', roles: ['Admin', 'FieldLead'] },
      { key: 'automation', icon: Cpu, path: '/automation', roles: ['Admin'] },
      { key: 'analytics', icon: BarChart3, path: '/analytics', roles: ['Admin'] },
      { key: 'settings', icon: Settings, path: '/settings', roles: ['Admin'] },
    ];
    return items;
  }, [language]);

  const availableRoles = useMemo(() => {
    const rawRoles = user?.roleNames ?? user?.roles?.map((r) => r.name) ?? [];
    return new Set(rawRoles.map((r) => r.toLowerCase()));
  }, [user]);

  const isActive = (path: string) => location.pathname.startsWith(path);
  const toggleCollapse = () => setCollapsed((v) => !v);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        collapsed ? 'var(--sidebar-width-collapsed, 5rem)' : 'var(--sidebar-width-expanded, 16rem)'
      );
    }
  }, [collapsed]);

  const slideDir = isRTL ? 300 : -300;
  const sidebarSide = isRTL ? 'end-0 border-s' : 'start-0 border-e';

  return (
    <>
      {/* ========== Desktop Sidebar ========== */}
      {!isMobile && (
        <motion.aside
          key={`sidebar-${direction}-${collapsed}`}
          initial={{ x: isRTL ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          dir={direction}
          className={cn(
            'glass-card sticky z-30 flex flex-col border-y-0 border-white/10 backdrop-blur-xl',
            sidebarSide
          )}
          style={{
            width: sidebarWidth,
            top: 'calc(var(--layout-header-height) + var(--spacing-lg))',
            height: 'calc(100vh - var(--layout-header-height) - (var(--spacing-lg) * 2))',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* ==== Header ==== */}
          <div
            className={cn(
              'flex h-16 items-center border-b border-white/10 px-4',
              collapsed ? 'justify-center' : 'justify-between'
            )}
            style={{ gap: collapsed ? '0' : 'var(--spacing-sm)' }}
          >
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow pulse-glow">
                    <Vote className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg neon-text whitespace-nowrap" style={{ color: 'hsl(var(--primary))' }}>
                    {t('app.name', { defaultValue: language === 'ar' ? 'فودا' : 'Foda' })}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="glass-button shrink-0"
              aria-label={t('navigation.toggleSidebar', { defaultValue: 'Toggle sidebar' })}
            >
              {collapsed
                ? isRTL
                  ? <ChevronLeft className="h-5 w-5" />
                  : <ChevronRight className="h-5 w-5" />
                : isRTL
                  ? <ChevronRight className="h-5 w-5" />
                  : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>

          {/* ==== Navigation ==== */}
          <nav
            className="flex-1 overflow-y-auto custom-scrollbar p-3"
            aria-label={t('navigation.main', { defaultValue: 'Main navigation' })}
            lang={language}
          >
            <ul className="space-y-1.5" dir={direction}>
              {navigationItems.map((item) => {
                const requiredRoles = item.roles?.map((r) => r.toLowerCase());
                const hasAccess = !requiredRoles || requiredRoles.some((r) => availableRoles.has(r));
                if (!hasAccess) return null;

                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <motion.li 
                    key={item.key} 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        'group relative flex items-center rounded-xl px-3.5 py-3 text-sm font-medium transition-colors duration-200',
                        isActive
                          ? 'bg-gradient-primary text-white shadow-glow'
                          : 'text-foreground hover:bg-muted/50 hover:text-primary',
                        collapsed ? 'justify-center' : 'gap-3.5',
                        !collapsed && isRTL && 'flex-row-reverse'
                      )}
                      style={{ minHeight: '3rem' }}
                    >
                      {/* Icon */}
                      <Icon
                        className={cn(
                          'h-5 w-5 shrink-0 transition-transform duration-200',
                          active && 'scale-110'
                        )}
                      />

                      {/* Label */}
                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="truncate text-sm font-medium leading-tight whitespace-nowrap"
                          >
                            {t(`navigation.${item.key}`, { defaultValue: item.key })}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip عند الطي */}
                      {collapsed && (
                        <div
                          className={cn(
                            'pointer-events-none absolute top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-xl bg-card/90 px-3 py-1 text-xs font-medium shadow-elegant opacity-0 transition-opacity group-hover:opacity-100',
                            isRTL ? 'end-full me-2' : 'start-full ms-2'
                          )}
                          style={{ backdropFilter: 'blur(12px)' }}
                        >
                          {t(`navigation.${item.key}`, { defaultValue: item.key })}
                        </div>
                      )}
                    </NavLink>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* ==== Footer ==== */}
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-t border-white/10 p-4 text-center text-xs text-muted-foreground"
              >
                {language === 'ar' ? 'إصدار ٢.٠' : 'Version 2.0'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      )}

      {/* ========== Mobile Sidebar ========== */}
      {isMobile && (
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
            >
              <motion.aside
                initial={{ x: slideDir }}
                animate={{ x: 0 }}
                exit={{ x: slideDir }}
                transition={{ duration: 0.3 }}
                dir={direction}
                className={cn(
                  'glass-card absolute top-0 flex h-full flex-col shadow-xl',
                  isRTL ? 'end-0' : 'start-0'
                )}
                style={{
                  width: sidebarWidthMobile,
                  padding: 'var(--spacing-lg)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold neon-text" style={{ color: 'hsl(var(--primary))' }}>
                    {t('app.name', { defaultValue: language === 'ar' ? 'فودا' : 'Foda' })}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto">
                  {navigationItems.map((item) => {
                    const requiredRoles = item.roles?.map((r) => r.toLowerCase());
                    const hasAccess = !requiredRoles || requiredRoles.some((r) => availableRoles.has(r));
                    if (!hasAccess) return null;

                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <NavLink
                        key={item.key}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
                        className={({ isActive }) => cn(
                          'flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors duration-200',
                          isActive
                            ? 'bg-gradient-primary text-white shadow-glow'
                            : 'text-foreground hover:bg-muted/50 hover:text-primary',
                          isRTL && 'flex-row-reverse'
                        )}
                        style={{ minHeight: '3rem' }}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="truncate">
                          {t(`navigation.${item.key}`, { defaultValue: item.key })}
                        </span>
                      </NavLink>
                    );
                  })}
                </nav>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};