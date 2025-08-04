import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Wallet,
  TrendingUp,
  Shield,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface NavigationItem {
  key: string;
  icon: any;
  path: string;
  badge?: number;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/' },
  { 
    key: 'users', 
    icon: Users, 
    path: '/users',
    children: [
      { key: 'all_users', icon: Users, path: '/users' },
      { key: 'roles', icon: Shield, path: '/users/roles' }
    ]
  },
  { key: 'analytics', icon: BarChart3, path: '/analytics' },
  { key: 'finance', icon: Wallet, path: '/finance' },
  { key: 'reports', icon: FileText, path: '/reports' },
  { key: 'trends', icon: TrendingUp, path: '/trends' },
  { key: 'messages', icon: MessageSquare, path: '/messages', badge: 3 },
  { key: 'notifications', icon: Bell, path: '/notifications', badge: 12 },
  { key: 'settings', icon: Settings, path: '/settings' },
];

interface SmartSidebarProps {
  defaultCollapsed?: boolean;
}

export const SmartSidebar = ({ defaultCollapsed = true }: SmartSidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { direction } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => 
      prev.includes(key) 
        ? prev.filter(g => g !== key)
        : [...prev, key]
    );
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';
  const mobileClasses = isMobile 
    ? 'fixed inset-y-0 z-50 transform transition-transform duration-300 ease-in-out'
    : 'relative';

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 lg:hidden glass-button"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Mobile Backdrop */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 64 : 256,
          x: isMobile ? (isMobileOpen ? 0 : -256) : 0
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={cn(
          "glass-card rounded-none border-y-0 border-l-0 flex flex-col h-screen z-40",
          mobileClasses,
          direction === 'rtl' ? 'border-r border-l-0' : 'border-r border-l-0'
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
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gradient-primary">
                  {t('app.name', 'ProDash')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isMobile && (
            <Button
              variant="glass"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              {isCollapsed ? (
                direction === 'rtl' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              ) : (
                direction === 'rtl' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedGroups.includes(item.key);
              
              return (
                <motion.li key={item.key} layout>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative cursor-pointer",
                      active 
                        ? 'bg-gradient-primary text-white shadow-glow' 
                        : 'hover:bg-white/10 text-foreground hover:text-primary',
                      isCollapsed ? 'justify-center' : ''
                    )}
                    onClick={() => {
                      if (hasChildren && !isCollapsed) {
                        toggleGroup(item.key);
                      }
                    }}
                  >
                    {hasChildren && !isCollapsed ? (
                      <div className="flex items-center gap-3 w-full">
                        <Icon className={cn("h-5 w-5", active && "animate-glow-pulse")} />
                        <span className="font-medium flex-1">{t(`navigation.${item.key}`)}</span>
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )} 
                        />
                      </div>
                    ) : (
                      <NavLink
                        to={item.path}
                        className="flex items-center gap-3 w-full"
                        onClick={() => isMobile && setIsMobileOpen(false)}
                      >
                        <div className="relative">
                          <Icon className={cn("h-5 w-5", active && "animate-glow-pulse")} />
                          {item.badge && (
                            <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {!isCollapsed && (
                          <span className="font-medium">{t(`navigation.${item.key}`)}</span>
                        )}
                      </NavLink>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className={cn(
                        "absolute z-50 px-2 py-1 bg-foreground text-background rounded text-sm",
                        "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap",
                        direction === 'rtl' 
                          ? 'right-full mr-2 top-1/2 transform -translate-y-1/2' 
                          : 'left-full ml-2 top-1/2 transform -translate-y-1/2'
                      )}>
                        {t(`navigation.${item.key}`)}
                      </div>
                    )}
                  </div>

                  {/* Submenu */}
                  <AnimatePresence>
                    {hasChildren && !isCollapsed && isExpanded && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-2 space-y-1 overflow-hidden"
                      >
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isActive(child.path);
                          
                          return (
                            <li key={child.key}>
                              <NavLink
                                to={child.path}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                                  childActive 
                                    ? 'bg-primary/20 text-primary' 
                                    : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
                                )}
                                onClick={() => isMobile && setIsMobileOpen(false)}
                              >
                                <ChildIcon className="h-4 w-4" />
                                <span className="text-sm">{t(`navigation.${child.key}`)}</span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
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
                ProDash v3.0
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};