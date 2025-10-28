import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { notifyNavClick } from '@/nav/nav.map';
import { useActiveNavIds, useNavTree, useNavigationContext } from '@/nav/useNavigationContext';
import type { NavNode } from '@/nav/nav.schema';
import { useNavBadgeCounts } from '@/nav/useNavBadges';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { cn } from '@shared/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 220,
  damping: 30,
} as const;

const findSectionIds = (nodes: NavNode[]): string[] => {
  const ids: string[] = [];
  const walk = (list: NavNode[]) => {
    list.forEach((node) => {
      if (node.children && node.children.length > 0) {
        ids.push(node.id);
        walk(node.children as NavNode[]);
      }
    });
  };
  walk(nodes);
  return ids;
};

const flattenNavNodes = (nodes: NavNode[]): NavNode[] => {
  const acc: NavNode[] = [];
  const walk = (list: NavNode[]) => {
    list.forEach((node) => {
      acc.push(node);
      if (node.children) {
        walk(node.children as NavNode[]);
      }
    });
  };
  walk(nodes);
  return acc;
};

export const Sidebar = ({ isOpen, onToggleCollapse, isMobile = false }: SidebarProps) => {
  const { language, direction } = useLanguage();
  const { t } = useTranslation();
  const navContext = useNavigationContext();
  const sidebarTree = useNavTree('sidebar');
  const activeIds = useActiveNavIds();
  const [isVisible, setIsVisible] = useState(true);
  const navRef = useRef<HTMLElement | null>(null);

  const sectionIds = useMemo(() => findSectionIds(sidebarTree), [sidebarTree]);

  const [expandedSections, setExpandedSections] = useState<string[]>(sectionIds);

  useEffect(() => {
    setExpandedSections(sectionIds);
  }, [sectionIds]);

  useEffect(() => {
    if (activeIds.size === 0) return;
    setExpandedSections((prev) => {
      const next = new Set(prev);
      sectionIds.forEach((id) => {
        if (activeIds.has(id)) {
          next.add(id);
        }
      });
      return Array.from(next);
    });
  }, [activeIds, sectionIds]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      if (Math.abs(current - lastScrollY) < 10) return;
      setIsVisible(current < lastScrollY);
      lastScrollY = current;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (id: string) =>
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((section) => section !== id) : [...prev, id],
    );

  const badgeSources = useMemo(() => {
    const sources = new Set<string>();
    flattenNavNodes(sidebarTree).forEach((node) => {
      const source = node.badge?.source;
      if (source) {
        sources.add(source);
      }
    });
    return sources;
  }, [sidebarTree]);

  const badgeValues = useNavBadgeCounts(badgeSources);

  const quickActions = useMemo(
    () =>
      flattenNavNodes(sidebarTree).filter(
        (node) => Boolean(node.path) && node.meta?.quickAction,
      ),
    [sidebarTree],
  );

  const ToggleIcon = useMemo(
    () =>
      direction === 'rtl'
        ? isOpen
          ? ChevronRight
          : ChevronLeft
        : isOpen
          ? ChevronLeft
          : ChevronRight,
    [direction, isOpen],
  );

  const toggleAriaLabel =
    language === 'ar'
      ? isOpen
        ? 'إخفاء القائمة الجانبية'
        : 'إظهار القائمة الجانبية'
      : isOpen
        ? 'Collapse sidebar'
        : 'Expand sidebar';

  const isNodeActive = (node: NavNode) => activeIds.has(node.id);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const container = navRef.current;
    if (!container) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>('[data-nav-focusable="true"]'),
    );
    if (focusables.length === 0) return;
    const activeElement = document.activeElement as HTMLElement | null;
    const currentIndex = activeElement ? focusables.indexOf(activeElement) : -1;
    let nextIndex = currentIndex;
    if (event.key === 'ArrowDown') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % focusables.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = focusables.length - 1;
    }
    if (nextIndex !== currentIndex && focusables[nextIndex]) {
      event.preventDefault();
      focusables[nextIndex].focus();
    }
  }, []);

  const getBadge = (node: NavNode) => {
    if (!node.badge) return null;
    if (node.badge.type === 'dot') {
      return <span className="inline-flex size-2 rounded-full bg-[hsl(var(--primary))]" />;
    }

    if (node.badge.type === 'count') {
      const value = node.badge.source ? badgeValues[node.badge.source] ?? 0 : 0;
      if (!value) return null;
      return (
        <span className="ml-auto inline-flex min-w-[1.5rem] items-center justify-center rounded-xl bg-[hsla(var(--primary)/0.15)] px-2 text-xs font-semibold text-[hsl(var(--primary))]">
          {value}
        </span>
      );
    }

    return null;
  };

  const renderNode = (node: NavNode) => {
    const label = t(node.i18nKey);
    const hasChildren = Boolean(node.children?.length);
    const sectionExpanded = hasChildren ? expandedSections.includes(node.id) : false;
    const Icon = node.icon;

    if (hasChildren && !node.path) {
      return (
        <li key={node.id} className="mb-3 last:mb-0" role="none">
          <button
            type="button"
            onClick={() => toggleSection(node.id)}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]"
            aria-expanded={sectionExpanded}
            aria-controls={`${node.id}-group`}
            role="menuitem"
            aria-haspopup="true"
            data-nav-focusable="true"
          >
            <span>{label}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                sectionExpanded ? 'rotate-0' : '-rotate-90',
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {sectionExpanded && (
              <motion.div
                key={`${node.id}-children`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={cn('flex flex-col gap-1', isOpen && 'mt-1')}
                id={`${node.id}-group`}
                role="group"
              >
                {node.children?.map((child) => renderNode(child))}
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      );
    }

    if (node.path) {
      return (
        <li key={node.id} role="none">
          <NavLink
            to={node.path}
            end={node.exact}
            aria-label={!isOpen ? label : undefined}
            onClick={() => notifyNavClick(node.id, node.path, navContext, 'sidebar')}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]',
                isActive || isNodeActive(node)
                  ? 'bg-[hsla(var(--primary)/0.2)] text-[hsl(var(--primary))] shadow-sm'
                  : 'text-muted-foreground hover:bg-[hsla(var(--primary)/0.08)] hover:text-foreground',
                !isOpen && 'justify-center px-0',
              )
            }
            role="menuitem"
            data-nav-focusable="true"
          >
            {Icon && <Icon className="h-5 w-5 shrink-0" />}
            {isOpen ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
            {isOpen && getBadge(node)}
          </NavLink>
        </li>
      );
    }

    return null;
  };

  const containerClasses = cn(
    'group/sidebar relative z-30 flex shrink-0 flex-col overflow-hidden rounded-[28px] border border-border/40 bg-[hsla(var(--card)/0.88)] p-4 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all',
    isMobile
      ? [
          'fixed inset-y-24 max-h-[calc(100vh-8rem)] w-[min(20rem,90vw)] overflow-y-auto',
          direction === 'rtl' ? 'right-4' : 'left-4',
        ]
      : 'sticky top-28 max-h-[calc(100vh-12rem)] self-start',
  );

  const headerLabel = t('nav.main', { defaultValue: 'Navigation' });

  return (
    <motion.aside
      layout
      initial={{ opacity: 0, x: direction === 'rtl' ? 40 : -40 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : direction === 'rtl' ? 100 : -100,
        width: isMobile ? 'min(20rem, 90vw)' : isOpen ? 280 : 88,
      }}
      transition={{ ...SPRING_TRANSITION, duration: 0.4 }}
      className={containerClasses}
      aria-label={t('nav.main')}
      role="navigation"
      dir={direction}
    >
      <div className="flex items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-[hsla(var(--primary)/0.15)] text-[hsl(var(--primary))]">
            <span className="text-sm font-semibold">AE</span>
          </div>
          {isOpen && (
            <div className="leading-tight">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Aurora Election
              </p>
              <p className="text-sm font-semibold text-foreground">{headerLabel}</p>
            </div>
          )}
        </div>

        {!isMobile && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={toggleAriaLabel}
            className="flex size-9 items-center justify-center rounded-2xl border border-border/40 bg-background/60 text-muted-foreground transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]"
          >
            <ToggleIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {quickActions.length > 0 && (
        <div className={cn('mb-3 flex flex-col gap-2', !isOpen && 'items-center')}>
          <p className={cn('text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground', !isOpen && 'sr-only')}>
            {t('nav.quickActions', { defaultValue: 'Quick actions' })}
          </p>
          <div className={cn('grid gap-2', isOpen ? 'grid-cols-1' : 'grid-cols-1')}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              const label = t(action.i18nKey);
              return (
                <NavLink
                  key={`quick-${action.id}`}
                  to={action.path!}
                  aria-label={!isOpen ? label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl border border-border/30 bg-background/70 px-3 py-2 text-sm font-medium shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]',
                      isActive
                        ? 'border-[hsla(var(--primary)/0.5)] text-[hsl(var(--primary))]'
                        : 'text-muted-foreground hover:border-[hsla(var(--primary)/0.4)] hover:text-foreground',
                      !isOpen && 'justify-center px-0',
                    )
                  }
                  data-nav-focusable="true"
                  onClick={() => notifyNavClick(action.id, action.path, navContext, 'sidebar-quick')}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {isOpen ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      <nav
        className="flex-1 overflow-y-auto pr-1"
        role="menu"
        aria-label={t('nav.main')}
        onKeyDown={handleKeyDown}
        ref={navRef}
      >
        <ul className="flex flex-col gap-1" role="none">
          {sidebarTree.map((node) => renderNode(node))}
        </ul>
      </nav>

      <div className="pt-4 text-center text-xs text-muted-foreground/80">
        {language === 'ar' ? '© جميع الحقوق محفوظة' : '© All rights reserved'}
      </div>
    </motion.aside>
  );
};
