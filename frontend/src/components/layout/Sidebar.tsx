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
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationItem {
  key: string;
  icon: any;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/' },
  { key: 'elections', icon: Vote, path: '/elections' },
  { key: 'geo_areas', icon: MapPin, path: '/geo-areas' },
  { key: 'committees', icon: Users, path: '/committees' },
  { key: 'voters', icon: UserCheck, path: '/voters' },
  { key: 'candidates', icon: Crown, path: '/candidates' },
  { key: 'agents', icon: Shield, path: '/agents' },
  { key: 'volunteers', icon: Heart, path: '/volunteers' },
  { key: 'observations', icon: Eye, path: '/observations' },
  { key: 'campaigns', icon: Megaphone, path: '/campaigns' },
  { key: 'analytics', icon: BarChart3, path: '/analytics' },
  { key: 'settings', icon: Settings, path: '/settings' },
];

export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { direction } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.aside
      initial={{ x: direction === 'rtl' ? 100 : -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        glass-card rounded-none border-y-0 border-l-0 
        flex flex-col h-screen sticky top-0 z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${direction === 'rtl' ? 'border-r border-l-0' : 'border-r border-l-0'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
              className="flex items-center gap-3"
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
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200 group relative
                    ${active 
                      ? 'bg-gradient-primary text-white shadow-glow' 
                      : 'hover:bg-white/10 text-foreground hover:text-primary'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon className={`h-5 w-5 ${active ? 'animate-glow-pulse' : ''}`} />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
                        className="font-medium"
                      >
                        {t(`navigation.${item.key}`)}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className={`
                      absolute ${direction === 'rtl' ? 'right-full mr-2' : 'left-full ml-2'} 
                      top-1/2 transform -translate-y-1/2
                      bg-foreground text-background px-2 py-1 rounded text-sm
                      opacity-0 group-hover:opacity-100 transition-opacity
                      pointer-events-none whitespace-nowrap z-50
                    `}>
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