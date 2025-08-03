import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { SidebarSection as SectionType, SidebarItem } from './sidebarConfig';

interface SectionProps {
  section: SectionType;
  openItems: string[];
  toggleItem: (key: string) => void;
  isActiveRoute: (path: string) => boolean;
  isParentActive: (item: SidebarItem) => boolean;
  onClose: () => void;
  direction: 'ltr' | 'rtl';
  language: string;
  t: (key: string) => string;
}

export const SidebarSection: React.FC<SectionProps> = ({
  section,
  openItems,
  toggleItem,
  isActiveRoute,
  isParentActive,
  onClose,
  direction,
  language,
  t,
}) => {
  return (
    <div className="space-y-1">
      <h2 className="px-4 pt-4 text-xs font-bold text-muted-foreground uppercase">
        {section.title}
      </h2>
      {section.items.map((item) => {
        const Icon = item.icon;
        const isActive = isParentActive(item);
        const isOpen = openItems.includes(item.key);
        const iconColor = item.color ?? '';

        if (item.children) {
          return (
            <Collapsible key={item.key} open={isOpen} onOpenChange={() => toggleItem(item.key)}>
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
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                    <span className={language === 'ar' ? 'font-arabic' : ''}>{t(item.label)}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${direction === 'rtl' ? 'rtl-flip' : ''}`}
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
                      data-active={isChildActive}
                    >
                      <ChildIcon className="h-4 w-4" />
                      <span className={language === 'ar' ? 'font-arabic' : ''}>{t(child.label)}</span>
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
            to={item.path || '#'}
            onClick={onClose}
            className={({ isActive: navIsActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-glow ${
                navIsActive || isActive
                  ? 'bg-primary/10 text-primary neon-glow-blue'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:neon-glow-orange'
              } ${direction === 'rtl' ? 'flex-row-reverse' : ''}`
            }
            data-active={isActiveRoute(item.path || '')}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <span className={`flex-1 ${language === 'ar' ? 'font-arabic' : ''}`}>{t(item.label)}</span>
            {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
          </NavLink>
        );
      })}
    </div>
  );
};
