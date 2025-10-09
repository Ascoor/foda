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
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

/**
 * Sidebar keeps navigation items aligned with the current interface direction.
 * The component listens to {@link LanguageContext} for language & direction
 * updates and mirrors layout, borders, padding, and animations accordingly.
 */

interface NavigationItem {
  key: string;
  icon: LucideIcon;
  path: string;
  roles?: string[];
}

export const Sidebar = () => {
  const { language, direction, t } = useLanguage();
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isRTL = direction === 'rtl';

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
      {
        key: 'observations',
        icon: Eye,
        path: '/observations',
        roles: ['Admin', 'FieldLead', 'Agent']
      },
      { key: 'campaigns', icon: Megaphone, path: '/campaigns', roles: ['Admin', 'FieldLead'] },
      { key: 'automation', icon: Cpu, path: '/automation', roles: ['Admin'] },
      { key: 'analytics', icon: BarChart3, path: '/analytics', roles: ['Admin'] },
      { key: 'settings', icon: Settings, path: '/settings', roles: ['Admin'] }
    ];

    return language === 'ar' ? items : items;
  }, [language]);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const availableRoles = useMemo(() => {
    const rawRoles = user?.roleNames ?? user?.roles?.map((role) => role.name) ?? [];
    return new Set(rawRoles.map((role) => role.toLowerCase()));
  }, [user]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '4rem' : '16rem');
    }
  }, [isCollapsed]);

  const sidebarWidth = isCollapsed ? '4rem' : '16rem';
  const sidebarPositionClass = isRTL ? 'right-0' : 'left-0';
  const sidebarBorderClass = isRTL ? 'border-s border-e-0' : 'border-e border-s-0';
  const toggleIconCollapsed = isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />;
  const toggleIconExpanded = isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />;

  return (
    <motion.aside
      key={direction}
      initial={{ x: isRTL ? 100 : -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      dir={direction}
      className={cn(
        'glass-card rounded-none border-y-0 fixed top-0 z-50 flex h-screen flex-col transition-[width,transform] duration-300 ease-in-out',
        sidebarPositionClass,
        sidebarBorderClass
      )}
      style={{ width: sidebarWidth }}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 ps-4 pe-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              className={cn(
                'flex items-center gap-3',
                isRTL && 'flex-row-reverse text-right'
              )}
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Vote className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gradient-primary">
                ElectionCircle
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="glass-button p-2"
          aria-label={t('navigation.toggleSidebar', { defaultValue: 'Toggle sidebar' })}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? toggleIconCollapsed : toggleIconExpanded}
        </Button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto custom-scrollbar p-4"
        aria-label={t('navigation.main', { defaultValue: 'Main navigation' })}
        lang={language}
      >
        <ul className="space-y-2" dir={direction}>
          {navigationItems.map((item) => {
            const requiredRoles = item.roles?.map((role) => role.toLowerCase());
            const hasAccess = !requiredRoles || requiredRoles.some((role) => availableRoles.has(role));

            if (!hasAccess) {
              return null;
            }

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
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                    active
                      ? 'bg-gradient-primary text-white shadow-glow'
                      : 'text-foreground hover:bg-white/10 hover:text-primary',
                    isCollapsed && 'justify-center',
                    !isCollapsed && isRTL && 'flex-row-reverse text-right'
                  )}
                >
                  <Icon className={`h-5 w-5 ${active ? 'animate-glow-pulse' : ''}`} />

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        className={cn('font-medium', isRTL && 'text-right')}
                      >
                        {t(`navigation.${item.key}`)}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div
                      className={cn(
                        'pointer-events-none absolute top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-sm text-background opacity-0 transition-opacity group-hover:opacity-100',
                        isRTL ? 'right-full me-2' : 'left-full ms-2'
                      )}
                    >
                      {t(`navigation.${item.key}`)}
                    </div>
                  )}
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-muted-foreground"
            >
              ElectionCircle v2.0
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};
