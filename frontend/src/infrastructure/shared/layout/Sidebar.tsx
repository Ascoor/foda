import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { notifyNavClick, findRouteMatch } from "@/routing/nav/nav.map";
import { useNavTree, useNavigationContext } from "@/routing/nav/useNavigationContext";
import type { NavNode } from "@/routing/nav/nav.schema";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { useNotifications } from "@/infrastructure/shared/contexts/NotificationContext";
import { cn } from "@/infrastructure/shared/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 220,
  damping: 30,
} as const;

const useBadgeValue = () => {
  try {
    const { unreadCount } = useNotifications();
    return { alerts: unreadCount };
  } catch {
    return { alerts: 0 };
  }
};

const collectAncestorIds = (node: NavNode | null | undefined): string[] => {
  const ids: string[] = [];
  let current = node?.parent;
  while (current) {
    ids.push(current.id);
    current = current.parent ?? undefined;
  }
  return ids;
};

export const Sidebar = ({
  isOpen,
  onToggleCollapse,
  isMobile = false,
}: SidebarProps) => {
  const { language, direction } = useLanguage();
  const { t } = useTranslation();
  const navContext = useNavigationContext();
  const sidebarTree = useNavTree("sidebar");
  const badgeValues = useBadgeValue();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  const activeMatch = useMemo(
    () => findRouteMatch(location.pathname, navContext),
    [location.pathname, navContext],
  );

  const activeIds = useMemo(() => {
    if (!activeMatch) return new Set<string>();
    return new Set<string>([
      activeMatch.id,
      ...collectAncestorIds(activeMatch.node),
    ]);
  }, [activeMatch]);

  const sectionIds = useMemo(
    () => sidebarTree.filter((node) => node.children?.length).map((node) => node.id),
    [sidebarTree],
  );

  const [expandedSections, setExpandedSections] = useState<string[]>(sectionIds);

  useEffect(() => {
    setExpandedSections((prev) => {
      if (prev.length > 0) {
        return prev;
      }
      return sectionIds;
    });
  }, [sectionIds]);

  useEffect(() => {
    if (!activeMatch) return;
    setExpandedSections((prev) => {
      const next = new Set(prev);
      collectAncestorIds(activeMatch.node).forEach((id) => next.add(id));
      return Array.from(next);
    });
  }, [activeMatch]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      if (Math.abs(current - lastScrollY) < 10) return;
      setIsVisible(current < lastScrollY);
      lastScrollY = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSection = (id: string) =>
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((section) => section !== id) : [...prev, id],
    );

  const ToggleIcon = useMemo(
    () =>
      direction === "rtl"
        ? isOpen
          ? ChevronRight
          : ChevronLeft
        : isOpen
          ? ChevronLeft
          : ChevronRight,
    [direction, isOpen],
  );

  const toggleAriaLabel =
    language === "ar"
      ? isOpen
        ? "إخفاء القائمة الجانبية"
        : "إظهار القائمة الجانبية"
      : isOpen
        ? "Collapse sidebar"
        : "Expand sidebar";

  const isNodeActive = (node: NavNode) => activeIds.has(node.id);

  const getBadge = (node: NavNode) => {
    if (!node.badge) return null;
    if (node.badge.type === "dot") {
      return <span className="inline-flex size-2 rounded-full bg-[hsl(var(--primary))]" />;
    }

    if (node.badge.type === "count") {
      const value = node.badge.source
        ? badgeValues[node.badge.source as keyof typeof badgeValues] ?? 0
        : 0;
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
        <div key={node.id} className="mb-3 last:mb-0">
          <button
            type="button"
            onClick={() => toggleSection(node.id)}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground transition hover:text-foreground"
          >
            <span>{label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                sectionExpanded ? "rotate-0" : "-rotate-90",
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {sectionExpanded && (
              <motion.div
                key={`${node.id}-children`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={cn("flex flex-col gap-1", isOpen && "mt-1")}
              >
                {node.children?.map((child) => renderNode(child))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (node.path) {
      return (
        <NavLink
          key={node.id}
          to={node.path}
          end={node.exact}
          aria-label={!isOpen ? label : undefined}
          onClick={() => notifyNavClick(node.id, node.path, navContext, "sidebar")}
          className={() =>
            cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all",
              isNodeActive(node)
                ? "bg-[hsla(var(--primary)/0.2)] text-[hsl(var(--primary))] shadow-sm"
                : "text-muted-foreground hover:bg-[hsla(var(--primary)/0.08)] hover:text-foreground",
              !isOpen && "justify-center px-0",
            )
          }
        >
          {Icon && <Icon className="h-5 w-5 shrink-0" />}
          {isOpen ? <span className="truncate">{label}</span> : <span className="sr-only">{label}</span>}
          {isOpen && getBadge(node)}
        </NavLink>
      );
    }

    return null;
  };

  const containerClasses = cn(
    "group/sidebar relative z-30 flex shrink-0 flex-col overflow-hidden rounded-[28px] border border-border/40 bg-[hsla(var(--card)/0.88)] p-4 shadow-[0_18px_48px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all",
    isMobile
      ? [
          "fixed inset-y-24 max-h-[calc(100vh-8rem)] w-[min(20rem,90vw)] overflow-y-auto",
          direction === "rtl" ? "right-4" : "left-4",
        ]
      : "sticky top-28 max-h-[calc(100vh-12rem)] self-start",
  );

  const headerLabel = t("navigation.main", { defaultValue: "Navigation" });

  return (
    <motion.aside
      layout
      initial={{ opacity: 0, x: direction === "rtl" ? 40 : -40 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : direction === "rtl" ? 100 : -100,
        width: isMobile ? "min(20rem, 90vw)" : isOpen ? 280 : 88,
      }}
      transition={{ ...SPRING_TRANSITION, duration: 0.4 }}
      className={containerClasses}
      aria-label={t("navigation.main")}
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
            className="flex size-9 items-center justify-center rounded-2xl border border-border/40 bg-background/60 text-muted-foreground transition hover:text-foreground"
          >
            <ToggleIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto pr-1">
        {sidebarTree.map((node) => renderNode(node))}
      </nav>

      <div className="pt-4 text-center text-xs text-muted-foreground/80">
        {language === "ar" ? "© جميع الحقوق محفوظة" : "© All rights reserved"}
      </div>
    </motion.aside>
  );
};
