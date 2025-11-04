import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { cn } from "@/infrastructure/shared/lib/utils";

import { useSidebar } from "../core";

import type { NavigationItem } from "./navigation.config";
import { SmartItem } from "./SmartItem";

export interface SmartNavigationProps {
  items: NavigationItem[];
  onNavigate?: () => void;
}

export const SmartNavigation: React.FC<SmartNavigationProps> = ({ items, onNavigate }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);

  const isActive = React.useCallback(
    (path: string) => {
      if (path === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(path);
    },
    [pathname],
  );

  React.useEffect(() => {
    if (isCollapsed) {
      setExpandedGroups([]);
      return;
    }

    setExpandedGroups((previous) => {
      const persistent = new Set(previous);
      items.forEach((item) => {
        if (item.children?.some((child) => isActive(child.path))) {
          persistent.add(item.key);
        }
      });
      return Array.from(persistent);
    });
  }, [isCollapsed, isActive, items]);

  const toggleGroup = React.useCallback((key: string) => {
    setExpandedGroups((prev) =>
      prev.includes(key) ? prev.filter((groupKey) => groupKey !== key) : [...prev, key],
    );
  }, []);

  return (
    <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <ul className="space-y-2">
        {items.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const expanded = expandedGroups.includes(item.key);
          const activeChild = item.children?.some((child) => isActive(child.path));
          const active = isActive(item.path) || Boolean(activeChild);
          const label = t(`navigation.${item.key}`, { defaultValue: item.label });

          return (
            <SmartItem
              key={item.key}
              item={item}
              label={label}
              direction={direction}
              isCollapsed={isCollapsed}
              isExpanded={expanded}
              isActive={active}
              onToggle={() => toggleGroup(item.key)}
              onNavigate={onNavigate}
              badge={item.badge}
            >
              <AnimatePresence initial={false}>
                {hasChildren && !isCollapsed && expanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "mt-2 space-y-1 overflow-hidden border-l border-sidebar-border pl-4",
                      direction === "rtl" ? "mr-6 border-l-0 border-r pr-4" : "ml-6",
                    )}
                  >
                    {item.children?.map((child) => {
                      const childLabel = t(`navigation.${child.key}`, {
                        defaultValue: child.label,
                      });
                      const childActive = isActive(child.path);

                      return (
                        <motion.li
                          key={child.key}
                          initial={{ opacity: 0, x: direction === "rtl" ? 16 : -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: direction === "rtl" ? 16 : -16 }}
                        >
                          <SmartItem
                            item={child}
                            label={childLabel}
                            direction={direction}
                            isCollapsed={false}
                            isActive={childActive}
                            onNavigate={onNavigate}
                            depth={1}
                          />
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </SmartItem>
          );
        })}
      </ul>
    </nav>
  );
};
