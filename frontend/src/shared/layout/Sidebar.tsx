import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { sidebarSections } from "@/config/sidebar-sections";
import { useLanguage } from "@shared/contexts/LanguageContext";
import { sidebarTranslations } from "@/i18n/sidebar";
import { cn } from "@shared/lib/utils";

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

export const Sidebar = ({
  isOpen,
  onToggleCollapse,
  isMobile = false,
}: SidebarProps) => {
  const { language, direction } = useLanguage();
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState<string[]>(() =>
    sidebarSections.filter((s) => s.items?.length).map((s) => s.key),
  );

  const [isVisible, setIsVisible] = useState(true);

  // ✅ Scroll Hide Logic
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

  useEffect(() => {
    if (!isOpen) return;
    setExpandedSections((prev) => {
      if (prev.length > 0) return prev;
      return sidebarSections.filter((s) => s.items?.length).map((s) => s.key);
    });
  }, [isOpen]);

  const toggleSection = (key: string) =>
    setExpandedSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const getLabel = (key: string) =>
    sidebarTranslations[language][
      key as keyof (typeof sidebarTranslations)["en"]
    ] ?? key;

  const isRouteActive = (path?: string): boolean =>
    !!path && location.pathname.startsWith(path);

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

  const baseLinkClasses =
    "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sidebar-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-surface)]";

  const containerClasses = cn(
    "group/sidebar relative z-30 flex shrink-0 flex-col overflow-hidden rounded-[28px] border bg-[var(--sidebar-surface)] p-4 text-[var(--sidebar-foreground)] shadow-[var(--sidebar-elevation)] backdrop-blur-xl transition-all",
    "border-[color:var(--sidebar-border)]",
    isMobile
      ? [
          "fixed inset-y-24 max-h-[calc(100vh-8rem)] w-[min(20rem,90vw)] overflow-y-auto",
          direction === "rtl" ? "right-4" : "left-4",
        ]
      : "sticky top-28 max-h-[calc(100vh-12rem)] self-start",
  );

  const headerLabel = getLabel("dashboard");

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
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, ${isMobile ? 0.22 : 0.16}), rgba(124, 58, 237, ${isMobile ? 0.24 : 0.18})), url('/assets/brand/pattern-bg.svg')`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🟣 Header */}
      <div className="flex items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-3xl bg-white/70 p-1.5 shadow-[0_10px_24px_rgba(37,99,235,0.22)] backdrop-blur dark:bg-slate-900/75">
            <img
              src="/assets/brand/foda-icon.svg"
              alt="Foda emblem"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
          {isOpen && (
            <div className="leading-tight text-[var(--sidebar-foreground)]">
              <p className="bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#FACC15] bg-clip-text text-[11px] font-semibold uppercase tracking-[0.28em] text-transparent">
                {language === "ar" ? "فوده مننا" : "Foda Minnna"}
              </p>
              <p className="text-sm font-semibold text-[var(--sidebar-foreground)]">
                {language === "ar" ? "منصة الحملات الذكية" : headerLabel}
              </p>
            </div>
          )}
        </div>

        {!isMobile && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={toggleAriaLabel}
            className="flex size-9 items-center justify-center rounded-2xl border border-[color:var(--sidebar-border)] bg-[var(--sidebar-button-bg)] text-[var(--sidebar-muted)] transition-colors hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sidebar-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-surface)]"
          >
            <ToggleIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 🧭 Navigation */}
      <nav className="flex-1 overflow-y-auto pr-1">
        {sidebarSections.map((section) => {
          const hasChildren = Boolean(section.items?.length);
          const sectionIsExpanded =
            !hasChildren || !isOpen || expandedSections.includes(section.key);

          const links = (
            section.items ??
            (section.path
              ? [{ key: section.key, icon: section.icon, path: section.path }]
              : [])
          ).map((item) => (
            <NavLink
              key={item.key}
              to={item.path ?? "#"}
              aria-label={!isOpen ? getLabel(item.key) : undefined}
              className={({ isActive }) =>
                cn(
                  baseLinkClasses,
                  isActive || isRouteActive(item.path)
                    ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-fg)] shadow-[var(--sidebar-active-shadow)]"
                    : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-fg)] hover:shadow-[var(--sidebar-hover-shadow)]",
                  !isOpen && "justify-center px-0",
                )
              }
            >
              {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
              {isOpen ? (
                <span className="truncate">{getLabel(item.key)}</span>
              ) : (
                <span className="sr-only">{getLabel(item.key)}</span>
              )}
            </NavLink>
          ));

          return (
            <div key={section.key} className="mb-3 last:mb-0">
              {hasChildren && isOpen && (
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--sidebar-section-label)] transition-colors hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-hover-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--sidebar-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar-surface)]"
                >
                  <span>{getLabel(section.key)}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      sectionIsExpanded ? "rotate-0" : "-rotate-90",
                    )}
                  />
                </button>
              )}

              <AnimatePresence initial={false}>
                {sectionIsExpanded && (
                  <motion.div
                    key={`${section.key}-links`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={cn(
                      "flex flex-col gap-1",
                      isOpen && hasChildren && "mt-1",
                    )}
                  >
                    {links}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* 🪶 Footer */}
      <div className="pt-4 text-center text-xs text-[var(--sidebar-footer)]">
        {language === "ar" ? "© جميع الحقوق محفوظة" : "© All rights reserved"}
      </div>
    </motion.aside>
  );
};
