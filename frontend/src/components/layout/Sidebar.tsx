import { Fragment, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Vote, X } from "lucide-react";
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
import { sidebarItems } from "./sidebarItems";

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 90,
  damping: 20,
} as const;

interface SidebarProps {
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  isMobile: boolean;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  layoutId?: string;
}

export const Sidebar = ({
  collapsed,
  onCollapseChange,
  isMobile,
  isMobileSidebarOpen,
  setMobileSidebarOpen,
  layoutId,
}: SidebarProps) => {
  const { language, direction, t } = useLanguage();
  const { user } = useAuth();
  const isRTL = direction === "rtl";

  // 🎯 صلاحيات المستخدم
  const availableRoles = useMemo(() => {
    const rawRoles = user?.roleNames ?? user?.roles?.map((r) => r.name) ?? [];
    return new Set(rawRoles.map((r) => r.toLowerCase()));
  }, [user]);

  // 🔍 تصفية العناصر بناءً على الأدوار
  const filteredItems = useMemo(
    () =>
      sidebarItems.filter((item) => {
        if (!item.roles?.length) return true;
        return item.roles.some((role) =>
          availableRoles.has(role.toLowerCase()),
        );
      }),
    [availableRoles],
  );

  // 🌍 ترجمة العنصر
  const renderNavItem = (key: string) =>
    t(`navigation.${key}`, { defaultValue: key.replace("_", " ") });
  const renderDesktopNav = () => (
    <TooltipProvider delayDuration={100}>
      <nav
        className={cn(
          "flex-1 overflow-y-auto transition-all duration-300 px-3 pb-6",
          collapsed && "overflow-hidden scrollbar-hide",
          isRTL ? "pr-4 text-right" : "pl-4 text-left",
        )}
        dir={direction}
      >
        <ul
          className={cn(
            "flex flex-col gap-1.5",
            isRTL ? "items-end justify-end" : "items-start justify-start",
          )}
        >
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group relative flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                    collapsed && "justify-center px-0",
                    isActive
                      ? "bg-[hsla(var(--accent)/0.18)] text-[hsl(var(--accent))]"
                      : "text-[hsl(var(--foreground))]/70 hover:bg-[hsla(var(--accent)/0.12)] hover:text-[hsl(var(--accent))]",
                    isRTL
                      ? "flex-row-reverse justify-end text-right"
                      : "flex-row justify-start text-left",
                  )
                }
              >
                {isRTL ? (
                  <>
                    <Icon className="order-last ml-2 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:text-[hsl(var(--accent))]" />
                    {!collapsed && (
                      <span className="truncate text-sm">
                        {renderNavItem(item.key)}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Icon className="order-first mr-2 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:text-[hsl(var(--accent))]" />
                    {!collapsed && (
                      <span className="truncate text-sm">
                        {renderNavItem(item.key)}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );

            return (
              <li
                key={item.key}
                className={cn(isRTL && "w-full flex justify-end")}
              >
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent
                      side={isRTL ? "left" : "right"}
                      className="border border-[hsla(var(--border)/0.2)] bg-[hsla(var(--color-surface)/0.95)] text-[hsl(var(--foreground))] shadow-md backdrop-blur-md"
                    >
                      {renderNavItem(item.key)}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </TooltipProvider>
  );

  // 📱 شريط الموبايل
  const renderMobileNav = () => (
    <nav
      className="mt-6 flex flex-col gap-2"
      aria-label={t("navigation.main", { defaultValue: "Main navigation" })}
      dir={direction}
    >
      {filteredItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.key}
            to={item.path}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-[hsla(var(--accent)/0.25)] text-[hsl(var(--foreground))]"
                  : "text-[hsl(var(--foreground))]/85 hover:bg-[hsla(var(--accent)/0.15)] hover:text-[hsl(var(--foreground))]",
                isRTL && "flex-row-reverse",
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{renderNavItem(item.key)}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  // 🏷️ بيانات العلامة والإصدار
  const brandLabel = language === "ar" ? "فودا برو" : "Foda Pro";
  const versionLabel = language === "ar" ? "الإصدار 1.0.0" : "Version 1.0.0";
  // 🧩 واجهة الشريط الكامل
  return (
    <Fragment>
      {/* 💻 Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          layoutId={layoutId}
          transition={SPRING_TRANSITION}
          dir={direction}
          className={cn(
            "fixed top-0 z-40 hidden h-full flex-col transition-[width,background,box-shadow] duration-500 ease-in-out md:flex",
            "backdrop-blur-lg shadow-2xl border border-[hsla(var(--border)/0.15)] text-[hsl(var(--foreground))]",
            isRTL ? "right-0 border-l" : "left-0 border-r",
            collapsed ? "w-20" : "w-72",
          )}
          style={{
            backgroundImage:
              "linear-gradient(180deg, hsla(var(--background)/0.92), hsla(var(--background-secondary)/0.85))",
          }}
        >
          {/* 🧩 الرأس */}
          <div
            className={cn(
              "relative flex h-20 items-center px-4 justify-center transition-all duration-300",
              isRTL && "flex-row-reverse",
            )}
          >
            {/* ====== زر الفتح/الإغلاق ثابت على الحافة ====== */}
            <motion.div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-50",
                // يطفو خارج الشريط
                isRTL
                  ? "-left-5 translate-x-full" // RTL: للخارج يسار
                  : "-right-5 -translate-x-full", // LTR: للخارج يمين
              )}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-xl border transition-all duration-300 shadow-lg backdrop-blur-md",
                  "border-[hsla(var(--border)/0.25)] bg-[hsla(var(--color-surface)/0.2)] text-[hsl(var(--foreground))]",
                  "hover:bg-[hsla(var(--accent)/0.2)] hover:text-[hsl(var(--accent))]",
                )}
                onClick={() => onCollapseChange(!collapsed)}
              >
                {isRTL ? (
                  collapsed ? (
                    <ChevronLeft className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )
                ) : collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
            </motion.div>

            {/* ====== البراند والشعار ====== */}
            <div
              className={cn(
                "flex items-center gap-3 transition-all duration-500 ease-in-out",
                isRTL && "flex-row-reverse",
                collapsed && "justify-center gap-2",
              )}
            >
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={cn(
                    "text-lg font-semibold tracking-wide select-none transition-colors duration-300",
                    "text-[hsl(var(--primary))] dark:text-[hsl(var(--accent))]",
                  )}
                >
                  {brandLabel}
                </motion.span>
              )}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300",
                  "bg-[hsl(var(--accent))] text-[hsl(var(--secondary-foreground))] shadow-md",
                  "ring-1 ring-[hsla(var(--border)/0.25)] hover:ring-[hsla(var(--accent)/0.55)] hover:shadow-[0_0_10px_hsl(var(--accent)/0.35)]",
                )}
              >
                <Vote className="h-5 w-5 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-xl bg-[hsla(var(--accent)/0.25)] blur-md opacity-60 dark:opacity-80" />
              </motion.div>
            </div>
          </div>

          {renderDesktopNav()}

          {/* ⬇️ الفوتر */}
          <div
            className={cn(
              "px-4 pb-6 text-xs text-[hsl(var(--foreground))]/70",
              collapsed && "text-center",
            )}
          >
            {collapsed ? (
              <span>{versionLabel}</span>
            ) : (
              <span className="tracking-wide">{versionLabel}</span>
            )}
          </div>
        </motion.aside>
      )}

      {/* 📱 Mobile Sidebar */}
      {isMobile && (
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <motion.aside
                dir={direction}
                className={cn(
                  "absolute top-0 flex h-full w-72 flex-col px-5 pb-8 pt-6 text-[hsl(var(--foreground))] shadow-2xl",
                  isRTL ? "right-0" : "left-0",
                )}
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, hsla(var(--background)/0.95), hsla(var(--background-secondary)/0.88))",
                }}
                initial={{ x: isRTL ? 300 : -300 }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? 300 : -300 }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={cn(
                    "flex items-center justify-between",
                    isRTL && "flex-row-reverse",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3",
                      isRTL && "flex-row-reverse",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--accent))] text-[hsl(var(--secondary-foreground))] shadow-md">
                      <Vote className="h-5 w-5" />
                    </div>
                    <span className="text-base font-semibold">
                      {brandLabel}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg border transition-colors border-[hsla(var(--border)/0.25)] bg-[hsla(var(--color-surface)/0.2)] text-[hsl(var(--foreground))] hover:bg-[hsla(var(--accent)/0.18)] hover:text-[hsl(var(--accent))]"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {renderMobileNav()}
                <p className="mt-auto text-xs text-[hsl(var(--foreground))]/70">
                  {versionLabel}
                </p>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Fragment>
  );
};
