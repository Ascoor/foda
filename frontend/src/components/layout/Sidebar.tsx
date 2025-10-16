import { Fragment, useMemo, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Vote,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  sidebarSections,
  type SidebarSectionConfig,
  type SidebarItemConfig,
} from "./sidebarItems";

interface SidebarProps {
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  isMobile: boolean;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const Sidebar = ({
  collapsed,
  onCollapseChange,
  isMobile,
  isMobileSidebarOpen,
  setMobileSidebarOpen,
}: SidebarProps) => {
  const { language, direction, t } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const isRTL = direction === "rtl";
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const sidebarSurfaceClass =
    theme === "dark"
      ? "bg-[hsla(var(--surface-secondary)/0.92)] text-[hsl(var(--foreground))]"
      : "bg-[hsla(var(--surface)/0.97)] text-[hsl(var(--foreground))]";

  const sidebarMobileSurfaceClass =
    theme === "dark"
      ? "bg-[hsla(var(--surface-secondary)/0.88)] text-[hsl(var(--foreground))]"
      : "bg-[hsla(var(--surface)/0.94)] text-[hsl(var(--foreground))]";

  const sidebarBorderClass =
    theme === "dark"
      ? "border-[hsla(var(--border)/0.35)]"
      : "border-[hsla(var(--border)/0.25)]";

  const accentSurfaceClass =
    theme === "dark"
      ? "bg-[hsla(var(--surface-secondary)/0.65)]"
      : "bg-[hsla(var(--surface-secondary)/0.55)]";

  const navBaseClass =
    "group flex flex-row items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 text-[hsl(var(--foreground))] opacity-80 hover:opacity-100 hover:bg-[hsla(var(--primary)/0.12)]";

  const navActiveClass =
    "bg-[hsla(var(--primary)/0.18)] text-[hsl(var(--foreground))] font-semibold ring-1 ring-[hsla(var(--primary)/0.35)] opacity-100 shadow-sm";

  const iconButtonClass =
    "flex items-center justify-center rounded-xl text-[hsl(var(--foreground))] opacity-80 transition-colors hover:bg-[hsla(var(--primary)/0.12)] hover:opacity-100";

  const brandBadgeClass =
    "flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-lg";

  const footerTextClass = "px-4 pb-6 text-center text-xs text-[hsl(var(--foreground))] opacity-60";


  const desktopShellClass =
    theme === "dark"
      ? "shadow-[0_0_45px_rgba(125,106,255,0.35)] backdrop-blur-2xl bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95 ring-1 ring-[hsla(var(--primary)/0.25)]"
      : "shadow-2xl backdrop-blur-xl";

  const mobileShellClass =
    theme === "dark"
      ? "shadow-[0_0_35px_rgba(125,106,255,0.35)] backdrop-blur-2xl bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/92 ring-1 ring-[hsla(var(--primary)/0.2)]"
      : "shadow-2xl backdrop-blur-xl";  // 🧩 صلاحيات المستخدم
  const availableRoles = useMemo(() => {
    const rawRoles = user?.roleNames ?? user?.roles?.map((r) => r.name) ?? [];
    return new Set(rawRoles.map((r) => r.toLowerCase()));
  }, [user]);

  // ✅ فلترة الأقسام حسب الصلاحيات
  const filteredSections = useMemo(() => {
    const allow = (roles?: string[]) =>
      !roles?.length || roles.some((r) => availableRoles.has(r.toLowerCase()));

    return sidebarSections
      .map((section) => {
        if (!allow(section.roles)) return null;
        if (section.items)
          return {
            ...section,
            items: section.items.filter((item) => allow(item.roles)),
          };
        return section;
      })
      .filter(Boolean) as SidebarSectionConfig[];
  }, [availableRoles]);

  // 🔍 تحديد المسار النشط
  const isPathActive = useCallback(
    (path: string) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname]
  );

  // افتح القسم الذي يحتوي على مسار نشط
  useEffect(() => {
    setOpenSections((prev) => {
      const next: Record<string, boolean> = {};
      filteredSections.forEach((s) => {
        const hasActive = s.items?.some((i) => isPathActive(i.path));
        next[s.key] = hasActive || prev[s.key] || false;
      });
      return next;
    });
  }, [filteredSections, isPathActive]);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderLabel = (key: string) =>
    t(`navigation.${key}`, { defaultValue: key.replace("_", " ") });

  // 🔹 عنصر فرعي
  const renderItem = (
    item: SidebarItemConfig,
    options?: {
      onNavigate?: () => void;
      variant?: 'desktop' | 'mobile';
    },
  ) => {
    const Icon = item.icon;
    const handleNavigate = () => {
      options?.onNavigate?.();
    };
    const isMobileVariant = options?.variant === 'mobile';
    return (
      <li key={item.key}>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            cn(
              navBaseClass,
              (isActive || isPathActive(item.path)) && navActiveClass,
 
              isMobileVariant && "text-base"
            )
          }
          onClick={handleNavigate}
        >
          <Icon className="mx-2 h-5 w-5 shrink-0" />
          {!(isMobileVariant ? false : collapsed) && (
            <span className="truncate">{renderLabel(item.key)}</span>
          )}
        </NavLink>
      </li>
    );
  };

  // 🔸 الأقسام الرئيسية
  const renderDesktopNav = () => (
    <TooltipProvider delayDuration={100}>
      <nav className="flex-1 overflow-y-auto px-3 pb-6" dir={direction}>
        <ul className="flex flex-col gap-2">
          {filteredSections.map((section) => {
            const SectionIcon = section.icon;
            const isOpen = openSections[section.key] ?? false;
            const hasItems = section.items && section.items.length > 0;

            // 📌 حالة القسم بدون قائمة فرعية
            if (section.path && !hasItems) {
              return (
                <li key={section.key}>
                  <NavLink
                    to={section.path}
                    className={({ isActive }) =>
                      cn(
                        navBaseClass,
                        "font-semibold",
                        (isActive || isPathActive(section.path!)) && navActiveClass,
                        
                        collapsed && "justify-center px-0"
                      )
                    }
                  >
                    {SectionIcon && <SectionIcon className="mx-2 h-5 w-5" />}
                    {!collapsed && (
                      <span className="truncate">{renderLabel(section.key)}</span>
                    )}
                  </NavLink>
                </li>
              );
            }

            // 📂 حالة وجود قائمة فرعية
            return (
              <li key={section.key}>
                {collapsed ? (
                  // 🧭 عرض أيقونة فقط مع Tooltip عندما يكون مصغّر
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "h-10 w-10 cursor-pointer",
                          iconButtonClass,
                          accentSurfaceClass,
                        )}
                      >
                        {SectionIcon && <SectionIcon className="h-5 w-5" />}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side={isRTL ? "left" : "right"}>
                      {renderLabel(section.key)}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  // 🧾 في الحالة الموسعة: عرض النص + السهم + القوائم الفرعية
                  <>
                    <motion.button
                      onClick={() => toggleSection(section.key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "group flex flex-row w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300",
                        "text-[hsl(var(--foreground))] opacity-80 hover:opacity-100 hover:bg-[hsla(var(--primary)/0.12)]",
                        isOpen && navActiveClass,
                     
                      )}
                    >
                      <span
                        className={cn(
                          "flex  flex-row items-center gap-2", 
                        )}
                      >
                        {SectionIcon && <SectionIcon className="h-5 w-5" />}
                        {!collapsed && <span>{renderLabel(section.key)}</span>}
                      </span>

                      <motion.span
                        animate={{ rotate: isOpen ? (isRTL ? -180 : 180) : 0 }}
                        transition={{ duration: 0.3 }}
                        className="opacity-70"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </motion.button>

                    <AnimatePresence initial={false}>
                      {isOpen && hasItems && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0, y: -10 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "ml-2 mt-1 flex flex-col gap-1 overflow-hidden border-l border-[hsla(var(--primary)/0.25)] pl-2",
                            isRTL && "mr-2 ml-0 border-r pr-2 border-l-0"
                          )}
                        >
                          {section.items!.map((item) => renderItem(item))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </TooltipProvider>
  );

  const brandLabel = language === "ar" ? "فودا برو" : "Foda Pro";
  const versionLabel = language === "ar" ? "الإصدار 1.0.0" : "Version 1.0.0";
  const expandedWidth = collapsed ? "5rem" : "17rem";

  const renderMobileNav = () => (
    <nav className="flex-1 overflow-y-auto px-4 pb-10" dir={direction}>
      <ul className="flex flex-col gap-3">
        {filteredSections.map((section) => {
          const SectionIcon = section.icon;
          const isOpen = openSections[section.key] ?? false;
          const hasItems = section.items && section.items.length > 0;

          if (section.path && !hasItems) {
            return (
              <li key={section.key}>
                <NavLink
                  to={section.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300",
                      accentSurfaceClass,
                      "text-[hsl(var(--foreground))] opacity-85 hover:opacity-100 hover:bg-[hsla(var(--primary)/0.12)]",
                      isActive || isPathActive(section.path!)
                        ? navActiveClass
                        : null
                    )
                  }
                  dir={direction}
                >
                  <span
                    className={cn(
                      "flex items-center gap-3",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {SectionIcon && <SectionIcon className="h-5 w-5" />}
                    <span className="truncate">{renderLabel(section.key)}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 opacity-60",
                      isRTL ? "rotate-180" : "rotate-0"
                    )}
                  />
                </NavLink>
              </li>
            );
          }

          return (
            <li key={section.key} className={cn("rounded-xl", accentSurfaceClass)}>
              <motion.button
                onClick={() => toggleSection(section.key)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-base font-semibold text-[hsl(var(--foreground))]",
                  "opacity-85 hover:opacity-100 hover:bg-[hsla(var(--primary)/0.12)]",
       
                )}
              >
                <span className="flex items-center gap-3">
                  {SectionIcon && <SectionIcon className="h-5 w-5" />}
                  <span>{renderLabel(section.key)}</span>
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? (isRTL ? -180 : 180) : 0 }}
                  transition={{ duration: 0.25 }}
                  className="opacity-70"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </motion.button>

              <AnimatePresence initial={false}>
                {isOpen && hasItems && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0, y: -8 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  className="flex flex-col gap-1 px-4 pb-3"
                >
                  {section.items!.map((item) =>
                    renderItem(item, {
                      onNavigate: () => setMobileSidebarOpen(false),
                      variant: 'mobile',
                    }),
                  )}
                </motion.ul>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <Fragment>
      {!isMobile && (
        <aside
          dir={direction}
          className={cn(
            "fixed top-0 z-40 hidden h-full flex-col shadow-2xl transition-[width] duration-300 ease-in-out md:flex",
            desktopShellClass,
                        sidebarSurfaceClass,
            isRTL ? "right-0 border-l" : "left-0 border-r",
            sidebarBorderClass,
          )}
          style={{ width: expandedWidth }}
        >
          {/* الرأس */}
          <div
            className={cn(
              "flex h-20 items-center px-4",
              collapsed ? "justify-center" : "justify-between",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex items-center flex-row gap-3",
                collapsed && "gap-0",
     collapsed && "flex-row-reverse"
              )}
            >
              <div className={brandBadgeClass}>
                <Vote className="h-5 w-5" />
              </div>
              {!collapsed && <span className="text-lg font-semibold">{brandLabel}</span>}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 border",
                iconButtonClass,
                accentSurfaceClass,
                sidebarBorderClass,
                isRTL ? "order-first" : "order-last"
              )}
              onClick={() => onCollapseChange(!collapsed)}
            >
              {isRTL ? (
                collapsed ? (
                  <ChevronLeft />
                ) : (
                  <ChevronRight />
                )
              ) : collapsed ? (
                <ChevronRight />
              ) : (
                <ChevronLeft />
              )}
            </Button>
          </div>

          {renderDesktopNav()}

          <div className={footerTextClass}>{versionLabel}</div>
        </aside>
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
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.aside
                dir={direction}
                className={cn(
                  "relative flex h-full w-full flex-col",
                  mobileShellClass,                  sidebarMobileSurfaceClass,
                )}
                initial={{ x: isRTL ? 80 : -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isRTL ? 60 : -60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-4",
 
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-row items-center gap-3",
 
                    )}
                  >
                    <div className={brandBadgeClass}>
                      <Vote className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold">{brandLabel}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 border",
                      iconButtonClass,
                      accentSurfaceClass,
                      sidebarBorderClass,
                    )}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {renderMobileNav()}

                <div className={footerTextClass}>{versionLabel}</div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Fragment>
  );
};
