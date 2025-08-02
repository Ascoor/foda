import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  BarChart3, 
  Settings, 
  ChevronDown,
  Target,
  Calendar,
  FileText,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    key: 'dashboard',
    icon: LayoutDashboard,
    path: '/',
    badge: null,
  },
  {
    key: 'campaigns',
    icon: Megaphone,
    path: '/campaigns',
    badge: 5,
    children: [
      { key: 'campaigns.create', path: '/campaigns/create', icon: Target },
      { key: 'campaigns.schedule', path: '/campaigns/schedule', icon: Calendar },
      { key: 'campaigns.reports', path: '/campaigns/reports', icon: FileText },
    ]
  },
  {
    key: 'teams',
    icon: Users,
    path: '/teams',
    badge: null,
    children: [
      { key: 'teams.members', path: '/teams/members', icon: Users },
      { key: 'teams.roles', path: '/teams/roles', icon: Settings },
    ]
  },
  {
    key: 'analytics',
    icon: BarChart3,
    path: '/analytics',
    badge: null,
    children: [
      { key: 'analytics.performance', path: '/analytics/performance', icon: BarChart3 },
      { key: 'analytics.reports', path: '/analytics/reports', icon: FileText },
      { key: 'analytics.data', path: '/analytics/data', icon: Database },
    ]
  },
  {
    key: 'settings',
    icon: Settings,
    path: '/settings',
    badge: null,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { direction, language, t } = useLanguage();
  const [openItems, setOpenItems] = React.useState<string[]>(['campaigns']);

  const toggleItem = (key: string) => {
    setOpenItems(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isParentActive = (item: any) => {
    if (isActiveRoute(item.path)) return true;
    if (item.children) {
      return item.children.some((child: any) => isActiveRoute(child.path));
    }
    return false;
  };

  const SidebarContent = () => (
    <nav className="flex-1 p-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = isParentActive(item);
        const isOpen = openItems.includes(item.key);

        if (item.children) {
          return (
            <Collapsible
              key={item.key}
              open={isOpen}
              onOpenChange={() => toggleItem(item.key)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-between transition-glow ${
                    isActive 
                      ? 'bg-primary/10 text-primary neon-glow-blue' 
                      : 'hover:bg-muted/50 hover:neon-glow-orange'
                  } ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-3 ${direction === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Icon className="h-5 w-5" />
                    <span className={language === 'ar' ? 'font-arabic' : ''}>
                      {t(`nav.${item.key}`)}
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
                      direction === 'rtl' ? 'rtl-flip' : ''
                    }`} 
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 ml-6 mt-1">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  const isChildActive = isActiveRoute(child.path);
                  
                  return (
                    <NavLink
                      key={child.key}
                      to={child.path}
                      onClick={onClose}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-glow ${
                          navIsActive || isChildActive
                            ? 'bg-secondary/20 text-secondary neon-glow-orange'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        } ${direction === 'rtl' ? 'flex-row-reverse' : ''}`
                      }
                    >
                      <ChildIcon className="h-4 w-4" />
                      <span className={language === 'ar' ? 'font-arabic' : ''}>
                        {t(child.key)}
                      </span>
                    </NavLink>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        }

        return (
          <NavLink
            key={item.key}
            to={item.path}
            onClick={onClose}
            className={({ isActive: navIsActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-glow ${
                navIsActive || isActive
                  ? 'bg-primary/10 text-primary neon-glow-blue'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:neon-glow-orange'
              } ${direction === 'rtl' ? 'flex-row-reverse' : ''}`
            }
          >
            <Icon className="h-5 w-5" />
            <span className={`flex-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t(`nav.${item.key}`)}
            </span>
            {item.badge && (
              <Badge variant="secondary">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-16 ${direction === 'rtl' ? 'right-0' : 'left-0'} h-[calc(100vh-4rem)] w-64 z-50
        glass-sidebar transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : direction === 'rtl' ? 'translate-x-full' : '-translate-x-full'}
        lg:relative lg:top-0 lg:h-screen lg:translate-x-0
        flex flex-col
      `}>
        <SidebarContent />
      </aside>
    </>
  );
};