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
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { user } = useAuth();
  const location = useLocation();
  const isRTL = direction === "rtl";
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // 🧩 صلاحيات المستخدم
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
  const renderItem = (item: SidebarItemConfig) => {
    const Icon = item.icon;
    return (
      <li key={item.key}>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            cn(
              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
              isActive || isPathActive(item.path)
                ? "bg-[#E7B10A]/15 text-white"
                : "text-white/80 hover:bg-[#E7B10A]/15 hover:text-white",
              isRTL ? "flex-row" : "flex-row-reverse"
            )
          }
        >
          <Icon className="h-5 w-5 shrink-0 mx-2" />
          {!collapsed && <span className="truncate">{renderLabel(item.key)}</span>}
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
                        "flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300",
                        isActive || isPathActive(section.path!)
                          ? "bg-[#E7B10A]/15 text-white"
                          : "text-white/80 hover:bg-[#E7B10A]/15 hover:text-white",
                        isRTL ? "flex-row" : "flex-row-reverse",
                        collapsed && "justify-center px-0"
                      )
                    }
                  >
                    {SectionIcon && <SectionIcon className="h-5 w-5 mx-2" />}
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
                          "flex justify-center items-center h-10 w-10 rounded-xl hover:bg-[#E7B10A]/15 text-white/85 cursor-pointer transition",
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
                        "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-300",
                        isRTL ? "flex-row" : "flex-row-reverse",
                        isOpen
                          ? "bg-[#E7B10A]/20 text-white"
                          : "text-white/75 hover:text-white hover:bg-[#E7B10A]/10"
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-2",
                          isRTL ? "flex-row" : "flex-row-reverse"
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
                            "ml-2 mt-1 flex flex-col gap-1 overflow-hidden border-l border-[#E7B10A]/20 pl-2",
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

  return (
    <Fragment>
      {!isMobile && (
        <aside
          dir={direction}
          className={cn(
            "fixed top-0 z-40 hidden h-full flex-col bg-[#1C3F60] text-white shadow-2xl transition-[width] duration-300 ease-in-out md:flex",
            isRTL ? "right-0 border-l border-[#E7B10A]/20" : "left-0 border-r border-[#E7B10A]/20"
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
                "flex items-center gap-3",
                collapsed && "gap-0",
                isRTL && !collapsed && "flex-row-reverse"
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7B10A] text-[#1C3F60] shadow-lg">
                <Vote className="h-5 w-5" />
              </div>
              {!collapsed && <span className="text-lg font-semibold">{brandLabel}</span>}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-[#E7B10A]/20",
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

          <div className="px-4 pb-6 text-xs text-white/65 text-center">
            {versionLabel}
          </div>
        </aside>
      )}
    </Fragment>
  );
};
