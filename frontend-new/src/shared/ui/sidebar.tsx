import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Map,
  MessageCircle,
  Plus,
  Settings,
  Users,
  Vote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@shared/lib/utils";
import { useLanguage } from "@shared/hooks";
import { Button } from "@shared/ui/button";

const sidebarSpring = { type: "spring", stiffness: 260, damping: 30 } as const;
const navSpring = { type: "spring", stiffness: 420, damping: 40 } as const;

type SidebarNavItemBadgeTone = "default" | "success" | "warning" | "info";

export type SidebarNavItem = {
  icon: LucideIcon;
  labelKey: string;
  path: string;
  badge?: string;
  badgeTone?: SidebarNavItemBadgeTone;
};

type SidebarNavSection = {
  titleKey: string;
  items: SidebarNavItem[];
};

type FocusMetric = {
  key: string;
  value: number;
  tone: "primary" | "sky" | "emerald";
};

export const sidebarNavSections: SidebarNavSection[] = [
  {
    titleKey: "missionControl",
    items: [
      { icon: Home, labelKey: "dashboard", path: "/dashboard" },
      { icon: BarChart3, labelKey: "analytics", path: "/analytics", badge: "Q4", badgeTone: "info" },
      { icon: MessageCircle, labelKey: "messages", path: "/messages", badge: "5", badgeTone: "warning" },
    ],
  },
  {
    titleKey: "groundGame",
    items: [
      { icon: Users, labelKey: "voters", path: "/voters", badge: "12.4k" },
      { icon: Users, labelKey: "volunteers", path: "/volunteers", badge: "418", badgeTone: "success" },
      { icon: Map, labelKey: "fieldTours", path: "/field-tours" },
      { icon: Vote, labelKey: "gotv", path: "/gotv", badge: "D-3", badgeTone: "warning" },
    ],
  },
  {
    titleKey: "intelHub",
    items: [
      { icon: Heart, labelKey: "donations", path: "/donations", badge: "$18k", badgeTone: "success" },
      { icon: Settings, labelKey: "settings", path: "/settings" },
    ],
  },
];

export const sidebarNavItems = sidebarNavSections.flatMap((section) => section.items);

const badgeToneStyles: Record<SidebarNavItemBadgeTone, string> = {
  default: "bg-[hsla(var(--primary)/0.12)] text-primary",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-400/15 text-amber-400",
  info: "bg-sky-400/15 text-sky-400",
};

const focusMetrics: FocusMetric[] = [
  { key: "doorKnocks", value: 82, tone: "primary" },
  { key: "phoneBanking", value: 68, tone: "sky" },
  { key: "eventCoverage", value: 54, tone: "emerald" },
];

const focusMetricToneStyles: Record<FocusMetric["tone"], string> = {
  primary: "bg-[hsla(var(--primary)/0.9)]",
  sky: "bg-sky-400",
  emerald: "bg-emerald-400",
};

type SidebarNavProps = {
  isCollapsed?: boolean;
};

export const SidebarNav = ({ isCollapsed = false }: SidebarNavProps) => {
  const { t } = useTranslation("common");

  return (
    <LayoutGroup id="sidebar-nav">
      <div className="mt-6 flex flex-col gap-6">
        {sidebarNavSections.map(({ titleKey, items }, sectionIndex) => (
          <motion.div key={titleKey} layout className="space-y-3">
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.p
                  key={`${titleKey}-label`}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="px-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground"
                >
                  {t(titleKey)}
                </motion.p>
              )}
            </AnimatePresence>
            <nav className="flex flex-col gap-1">
              {items.map(({ icon: Icon, labelKey, path, badge, badgeTone }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/dashboard"}
                  className="group relative block"
                  aria-label={t(labelKey)}
                >
                  {({ isActive }) => (
                    <motion.div
                      layout
                      transition={navSpring}
                      className={cn(
                        "relative flex items-center gap-3 overflow-visible rounded-[var(--radius-lg)] px-3 py-2 text-sm font-medium transition-colors",
                        isCollapsed ? "justify-center" : "justify-start",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav"
                          transition={navSpring}
                          className="absolute inset-0 rounded-[var(--radius-lg)] bg-[linear-gradient(135deg,_hsla(var(--primary)/0.18),_hsla(var(--secondary)/0.18))] shadow-[0_18px_42px_-28px_hsla(var(--primary)/0.35)]"
                        />
                      )}
                      <Icon className="relative z-10 h-5 w-5" />
                      <AnimatePresence mode="wait" initial={false}>
                        {!isCollapsed && (
                          <motion.span
                            key={labelKey}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18 }}
                            className="relative z-10"
                          >
                            {t(labelKey)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <AnimatePresence initial={false}>
                        {badge && !isCollapsed && (
                          <motion.span
                            key={`${labelKey}-badge`}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.18 }}
                            className={cn(
                              "relative z-10 ml-auto inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.26em]",
                              badgeToneStyles[badgeTone ?? "default"],
                            )}
                          >
                            {badge}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isCollapsed && (
                        <span className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2 translate-x-3 whitespace-nowrap rounded-[var(--radius-lg)] bg-foreground/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-background opacity-0 shadow-[0_14px_38px_-28px_rgba(0,0,0,0.55)] transition-opacity duration-150 group-hover:opacity-100">
                          {t(labelKey)}
                          {badge ? (
                            <span
                              className={cn(
                                "ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                badgeToneStyles[badgeTone ?? "default"],
                              )}
                            >
                              {badge}
                            </span>
                          ) : null}
                        </span>
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>
            {sectionIndex < sidebarNavSections.length - 1 && (
              <motion.div
                layout
                transition={navSpring}
                className="h-px rounded-full bg-border/40"
                animate={{
                  opacity: isCollapsed ? 0.4 : 0.65,
                  marginInline: isCollapsed ? 8 : 0,
                  scaleX: isCollapsed ? 0.7 : 1,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </LayoutGroup>
  );
};

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { direction } = useLanguage();
  const { t } = useTranslation("common");

  const ToggleIcon = useMemo(() => {
    if (direction === "rtl") {
      return isCollapsed ? ChevronLeft : ChevronRight;
    }
    return isCollapsed ? ChevronRight : ChevronLeft;
  }, [direction, isCollapsed]);

  return (
    <motion.aside
      layout
      initial={{ opacity: 0, x: direction === "rtl" ? 64 : -64 }}
      animate={{ opacity: 1, x: 0, width: isCollapsed ? 96 : 288 }}
      transition={sidebarSpring}
      className="relative hidden h-full shrink-0 flex-col overflow-hidden border-r border-border/50 bg-[hsla(var(--background)/0.92)] px-4 py-6 text-foreground shadow-[var(--shadow-md)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturation)] md:flex"
      style={{
        backgroundImage: "url('/assets/brand/pattern-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(140deg,hsla(var(--background)/0.88)_0%,hsla(var(--background)/0.62)_48%,hsla(var(--background)/0.78)_100%)]" />
      <div className="flex h-full flex-col gap-6">
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "justify-between")}>
          <motion.div layout className="flex items-center gap-3">
            <motion.div layout transition={sidebarSpring} className="flex items-center justify-center">
              <img
                src="/assets/brand/foda-icon.svg"
                alt="Foda Elections icon"
                className="h-10 w-10 drop-shadow-[0_16px_34px_rgba(124,58,237,0.32)]"
              />
            </motion.div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  key="brand"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="leading-tight"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                    Foda Elections
                  </p>
                  <p className="text-sm font-semibold text-foreground">فوده مننا</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <Button
            type="button"
            size="icon"
            variant="glass"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground lg:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ToggleIcon className="h-4 w-4" />
          </Button>
        </div>

        <SidebarNav isCollapsed={isCollapsed} />

        <div className="mt-auto rounded-[var(--radius-xl)] border border-dashed border-primary/40 bg-[hsla(var(--primary)/0.08)] p-4 text-xs shadow-[0_18px_45px_-30px_hsla(var(--primary)/0.35)]">
          <motion.div
            layout
            className={cn(
              "flex items-center gap-2 text-primary",
              isCollapsed ? "justify-center" : "justify-start",
            )}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"
            />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  key="live-sync"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                >
                  {t("liveSync")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                key="campaign-info"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.24 }}
                className="mt-4 space-y-4 text-muted-foreground"
              >
                <div className="space-y-1 text-left">
                  <p className="text-sm font-semibold text-primary">{t("campaignPulseTitle")}</p>
                  <p className="text-xs leading-relaxed">{t("campaignPulseDescription")}</p>
                </div>

                <div className="space-y-3">
                  {focusMetrics.map(({ key, value, tone }) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24 }}
                      className="space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.26em]">
                        <span>{t(key)}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={cn("h-full rounded-full", focusMetricToneStyles[tone])}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  variant="glass"
                  size="sm"
                  className="w-full justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("newBriefing")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};
