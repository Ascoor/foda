import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  Menu,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavigationItem {
  key: string;
  icon: any;
  path: string;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
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

export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { direction } = useLanguage();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const availableRoles = new Set((user?.roleNames ?? user?.roles?.map((role) => role.name) ?? []).map((role) => role.toLowerCase()));

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      initial={{ x: direction === 'rtl' ? 100 : -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      dir={direction}
      className={cn(
        'glass-card rounded-none border-y-0 flex h-screen flex-col sticky top-0 z-50 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        direction === 'rtl' ? 'border-l border-r-0' : 'border-r border-l-0'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
              className={cn(
                'flex items-center gap-3',
                direction === 'rtl' && 'flex-row-reverse text-right'
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
        >
          {isCollapsed ? (
            direction === 'rtl' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            direction === 'rtl' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <ul className="space-y-2">
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
                    !isCollapsed && direction === 'rtl' && 'flex-row-reverse text-right'
                  )}
                >
                  <Icon className={`h-5 w-5 ${active ? 'animate-glow-pulse' : ''}`} />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
                        className={cn('font-medium', direction === 'rtl' && 'text-right')}
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
                        direction === 'rtl' ? 'right-full mr-2' : 'left-full ml-2'
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
              className="text-xs text-muted-foreground text-center"
            >
              ElectionCircle v2.0
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};
