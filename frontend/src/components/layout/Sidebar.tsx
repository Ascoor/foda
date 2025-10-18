import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Vote,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

import {
  sidebarSections,
  type SidebarItemConfig,
  type SidebarSectionConfig,
} from "./sidebarItems";

const COLLAPSED_WIDTH = 88;
const EXPANDED_WIDTH = 296;

interface SidebarProps {
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  isMobile: boolean;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  onWidthChange?: (width: number) => void;
}

export const Sidebar = ({
  collapsed,
  onCollapseChange,
  isMobile,
  isMobileSidebarOpen,
  setMobileSidebarOpen,
  onWidthChange,
}: SidebarProps) => {
  const { language, direction, t } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const isRTL = direction === "rtl";

  const [hovered, setHovered] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const isExpanded = !collapsed || hovered;

  const sidebarWidth = isMobile
    ? 0
    : isExpanded
      ? EXPANDED_WIDTH
      : COLLAPSED_WIDTH;

  useEffect(() => {
    onWidthChange?.(sidebarWidth);
  }, [sidebarWidth, onWidthChange]);

  const brandLabel = language === "ar" ? "فودا برو" : "Foda Pro";
  const versionLabel = language === "ar" ? "الإصدار 1.0.0" : "Version 1.0.0";

  const availableRoles = useMemo(() => {
    const rawRoles = user?.roleNames ?? user?.roles?.map((role) => role.name) ?? [];
    return new Set(rawRoles.map((role) => role.toLowerCase()));
  }, [user]);

  const filteredSections = useMemo(() => {
    const allow = (roles?: string[]) =>
      !roles?.length || roles.some((role) => availableRoles.has(role.toLowerCase()));

    return sidebarSections
      .map((section) => {
        if (!allow(section.roles)) return null;
        if (section.items) {
          return {
            ...section,
            items: section.items.filter((item) => allow(item.roles)),
          } satisfies SidebarSectionConfig;
        }
        return section;
      })
      .filter(Boolean) as SidebarSectionConfig[];
  }, [availableRoles]);

  const isPathActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  );

  useEffect(() => {
    setOpenSections((prev) => {
      const next: Record<string, boolean> = {};
      filteredSections.forEach((section) => {
        const hasActive = section.items?.some((item) => isPathActive(item.path));
        next[section.key] = hasActive || prev[section.key] || false;
      });
      return next;
    });
  }, [filteredSections, isPathActive]);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  const handleNavigate = () => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  const glassBackground = theme === "dark"
    ? "linear-gradient(135deg, hsla(var(--surface-secondary)/0.95), hsla(var(--surface)/0.88))"
    : "linear-gradient(135deg, hsla(var(--surface)/0.9), hsla(var(--surface-secondary)/0.72))";

  const shellShadow =
    theme === "dark"
      ? "0 24px 65px hsla(var(--primary)/0.22)"
      : "0 24px 45px hsla(var(--primary)/0.15)";

  const navBaseClass = cn(
    "group relative flex items-center gap-3 rounded-[18px] px-3 py-2 text-sm font-semibold transition-all duration-300",
    "text-[hsl(var(--foreground))]/80 hover:text-[hsl(var(--foreground))]",
  );

  const navActiveClass = cn(
    "text-[hsl(var(--foreground))]",
    "bg-gradient-to-r from-[hsla(var(--primary)/0.22)] via-[hsla(var(--accent)/0.18)] to-[hsla(var(--primary)/0.2)]",
    "shadow-[0_12px_35px_rgba(79,70,229,0.22)]",
  );

  const renderItem = (
    item: SidebarItemConfig,
    options?: {
      variant?: "desktop" | "mobile";
    },
  ) => {
    const Icon = item.icon;
    const variant = options?.variant ?? "desktop";
    const isActive = isPathActive(item.path);
    const content = (
      <span
        className={cn(
          "flex flex-1 items-center gap-3",
          isRTL && "flex-row-reverse",
          !isExpanded && variant === "desktop" && "justify-center",
        )}
      >
        <motion.span
          layout
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            isActive
              ? "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-[hsl(var(--primary-foreground))]"
              : "bg-[hsla(var(--surface-secondary)/0.45)] text-[hsl(var(--foreground))]",
          )}
          whileHover={{ scale: 1.05 }}
        >
          <Icon className="h-5 w-5" />
        </motion.span>
        {variant === "mobile" || isExpanded ? (
          <motion.span
            layout
            initial={false}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {t(`navigation.${item.key}`, { defaultValue: item.key.replace(/_/g, " ") })}
          </motion.span>
        ) : null}
      </span>
    );

    const link = (
      <NavLink
        to={item.path}
        onClick={handleNavigate}
        className={({ isActive: active }) =>
          cn(
            navBaseClass,
            variant === "desktop" && !isExpanded && "px-0",
            (active || isActive) && navActiveClass,
          )
        }
      >
        {content}
        {isExpanded && variant === "desktop" && (
          <motion.span
            layoutId="sidebar-active-indicator"
            className="absolute inset-y-1 flex items-center justify-end"
            animate={{
              [isRTL ? "left" : "right"]: (isPathActive(item.path) ? -6 : -12),
            }}
          >
            {isPathActive(item.path) && (
              <motion.span
                layoutId={`dot-${item.key}`}
                className="h-2 w-2 rounded-full bg-white shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />
            )}
          </motion.span>
        )}
      </NavLink>
    );

    if (variant === "desktop" && !isExpanded) {
      return (
        <Tooltip key={item.key} delayDuration={120}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side={isRTL ? "left" : "right"}>
            {t(`navigation.${item.key}`, { defaultValue: item.key.replace(/_/g, " ") })}
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Fragment key={item.key}>{link}</Fragment>
    );
  };

  const renderDesktopSection = (section: SidebarSectionConfig) => {
    const SectionIcon = section.icon;
    const isOpen = openSections[section.key] ?? false;
    const hasItems = section.items && section.items.length > 0;
    const label = t(`navigation.${section.key}`, { defaultValue: section.key.replace(/_/g, " ") });

    if (section.path && !hasItems) {
      const item: SidebarItemConfig = {
        key: section.key,
        path: section.path,
        icon: SectionIcon,
      };
      return <li key={section.key}>{renderItem(item)}</li>;
    }

    return (
      <li key={section.key} className="space-y-1">
        {isExpanded ? (
          <motion.button
            onClick={() => toggleSection(section.key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              navBaseClass,
              "w-full justify-between",
              isOpen && navActiveClass,
            )}
          >
            <span className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsla(var(--surface-secondary)/0.45)]",
                  isOpen && "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-[hsl(var(--primary-foreground))]",
                )}
              >
                {SectionIcon && <SectionIcon className="h-5 w-5" />}
              </span>
              <span className="truncate">{label}</span>
            </span>
            <motion.span
              animate={{ rotate: isOpen ? (isRTL ? -180 : 180) : 0 }}
              transition={{ duration: 0.3 }}
              className="opacity-70"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </motion.button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsla(var(--surface-secondary)/0.45)]"
              >
                {SectionIcon && <SectionIcon className="h-5 w-5" />}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side={isRTL ? "left" : "right"}>{label}</TooltipContent>
          </Tooltip>
        )}

        <AnimatePresence initial={false}>
          {isExpanded && isOpen && hasItems && (
            <motion.ul
              key={`${section.key}-items`}
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "ms-4 flex flex-col gap-1 border-s border-[hsla(var(--primary)/0.35)] ps-3",
                isRTL && "ms-0 me-4 border-s-0 border-e pe-3",
              )}
            >
              {section.items!.map((item) => renderItem(item))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

  const renderMobileSection = (section: SidebarSectionConfig) => {
    const SectionIcon = section.icon;
    const isOpen = openSections[section.key] ?? false;
    const hasItems = section.items && section.items.length > 0;
    const label = t(`navigation.${section.key}`, { defaultValue: section.key.replace(/_/g, " ") });

    if (section.path && !hasItems) {
      const item: SidebarItemConfig = {
        key: section.key,
        path: section.path,
        icon: SectionIcon,
      };
      return <li key={section.key}>{renderItem(item, { variant: "mobile" })}</li>;
    }

    return (
      <li key={section.key} className="overflow-hidden rounded-2xl border border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface)/0.75)]">
        <motion.button
          onClick={() => toggleSection(section.key)}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-base font-semibold"
        >
          <span className="flex items-center gap-3">
            {SectionIcon && (
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsla(var(--surface-secondary)/0.55)]">
                <SectionIcon className="h-5 w-5" />
              </span>
            )}
            {label}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="opacity-60"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.button>
        <AnimatePresence initial={false}>
          {isOpen && hasItems && (
            <motion.ul
              initial={{ height: 0, opacity: 0, y: -6 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-1 px-4 pb-4"
            >
              {section.items!.map((item) => renderItem(item, { variant: "mobile" }))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

  const sidebarContent = (
    <div className="relative flex h-full flex-col">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent dark:from-white/4" />
        <div className="absolute top-1/3 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      </div>

      <div
        className={cn(
          "relative z-10 flex h-24 items-center gap-3 px-4",
          isRTL ? "flex-row-reverse" : "flex-row",
          !isExpanded && "justify-center",
        )}
      >
        <motion.div
          layout
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-[hsl(var(--primary-foreground))] shadow-lg"
        >
          <Vote className="h-6 w-6" />
        </motion.div>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              className="flex flex-1 flex-col"
            >
              <span className="text-base font-semibold text-[hsl(var(--foreground))]">{brandLabel}</span>
              <span className="text-xs text-muted-foreground">{versionLabel}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          aria-label={collapsed ? (language === "ar" ? "توسيع القائمة" : "Expand sidebar") : language === "ar" ? "طي القائمة" : "Collapse sidebar"}
          className={cn(
            "rounded-2xl border border-[hsla(var(--border)/0.25)] bg-[hsla(var(--surface-secondary)/0.4)]",
          )}
          onClick={() => onCollapseChange(!collapsed)}
        >
          {collapsed ? (
            isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-3 pb-6">
        <TooltipProvider delayDuration={100}>
          <nav dir={direction}>
            <ul className="flex flex-col gap-2">
              {filteredSections.map((section) => renderDesktopSection(section))}
            </ul>
          </nav>
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <Fragment>
      {!isMobile && (
        <motion.aside
          dir={direction}
          className={cn(
            "fixed top-4 bottom-4 z-40 hidden flex-col overflow-hidden rounded-[32px] border shadow-2xl md:flex",
            theme === "dark"
              ? "border-[hsla(var(--border)/0.25)]"
              : "border-[hsla(var(--border)/0.15)]",
            isRTL ? "right-4" : "left-4",
          )}
          style={{
            width: sidebarWidth,
            background: glassBackground,
            backdropFilter: "blur(24px) saturate(185%)",
            WebkitBackdropFilter: "blur(24px) saturate(185%)",
            boxShadow: shellShadow,
            transition: "width 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {sidebarContent}
        </motion.aside>
      )}

      {isMobile && (
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.aside
                dir={direction}
                className={cn(
                  "absolute inset-y-4 mx-4 flex w-[min(320px,calc(100%-2rem))] flex-col overflow-hidden rounded-[28px] border shadow-2xl",
                  theme === "dark"
                    ? "border-[hsla(var(--border)/0.25)]"
                    : "border-[hsla(var(--border)/0.15)]",
                  isRTL ? "right-0" : "left-0",
                )}
                style={{
                  background: glassBackground,
                  backdropFilter: "blur(22px) saturate(185%)",
                  WebkitBackdropFilter: "blur(22px) saturate(185%)",
                  boxShadow: shellShadow,
                }}
                initial={{ x: isRTL ? 80 : -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isRTL ? 60 : -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-[hsl(var(--primary-foreground))] shadow-lg">
                      <Vote className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-[hsl(var(--foreground))]">{brandLabel}</span>
                      <span className="text-xs text-muted-foreground">{versionLabel}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-2xl border border-[hsla(var(--border)/0.25)]"
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-label={language === "ar" ? "إغلاق القائمة" : "Close sidebar"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6" dir={direction}>
                  <ul className="flex flex-col gap-3">
                    {filteredSections.map((section) => renderMobileSection(section))}
                  </ul>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Fragment>
  );
};
