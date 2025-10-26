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
 
export const sidebarNavItems: SidebarNavItem[] = sidebarNavSections.flatMap((section) => section.items);

const badgeToneStyles: Record<SidebarNavItemBadgeTone, string> = {
  default: "bg-[var(--navigation-badge-background)] text-[color:var(--navigation-badge-foreground)]",
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
  const { t } = useTranslation();

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
                  {t(`common.${titleKey}`)}
                </motion.p>
              )}
            </AnimatePresence>
            <nav className="flex flex-col gap-2">
              {items.map(({ icon: Icon, labelKey, path, badge, badgeTone }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/dashboard"}
                  className="group relative block"
                  aria-label={t(`common.${labelKey}`)}
                >
                  {({ isActive }) => (
                    <motion.div
                      layout
                      transition={navSpring}
                      className={cn(
                        "relative flex items-center gap-3 overflow-visible rounded-[var(--radius-xl)] px-3 py-2 text-sm font-semibold tracking-tight transition-all duration-300",
                        isCollapsed ? "justify-center" : "justify-start",
                      )}
                      style={{
                        color: isActive ? "var(--navigation-text)" : "var(--navigation-text-muted)",
                        background: isActive
                          ? "var(--navigation-active-background)"
                          : "var(--navigation-row-background)",
                        border: isActive
                          ? `1px solid var(--navigation-row-border-active)`
                          : `1px solid var(--navigation-row-border)`,
                        boxShadow: isActive
                          ? "var(--navigation-active-glow)"
                          : "var(--navigation-row-shadow)",
                        backdropFilter: "blur(var(--glass-blur)) saturate(160%)",
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav"
                          transition={navSpring}
                          className="absolute inset-0 rounded-[var(--radius-xl)]"
                          style={{
                            background: "var(--navigation-active-background)",
                            boxShadow: "var(--navigation-active-glow)",
                          }}
                        />
                      )}
                      <span
                        className="relative z-10 flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] transition-all duration-300 before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_top,var(--navigation-icon-highlight),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100"
                        style={{
                          background: "var(--navigation-icon-background)",
                          boxShadow: isActive
                            ? "var(--navigation-icon-shadow-active)"
                            : "var(--navigation-icon-shadow)",
                          color: isActive
                            ? "var(--navigation-icon-foreground)"
                            : "var(--navigation-icon-foreground-muted)",
                          border: isActive
                            ? `1px solid var(--navigation-icon-ring-active)`
                            : `1px solid var(--navigation-icon-ring)`,
                        }}
                      >
                        <Icon className="relative z-10 h-4 w-4" />
                      </span>
                      <AnimatePresence mode="wait" initial={false}>
                        {!isCollapsed && (
                          <motion.span
                            key={labelKey}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.18 }}
                            className="relative z-10 drop-shadow-[0_6px_18px_rgba(15,23,42,0.18)]"
                          >
                            {t(`common.${labelKey}`)}
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
                              "relative z-10 ml-auto inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] shadow-[0_12px_28px_rgba(15,23,42,0.18)]",
                              badgeToneStyles[badgeTone ?? "default"],
                            )}
                          >
                            {badge}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isCollapsed && (
                        <span
                          className="pointer-events-none absolute left-full top-1/2 z-50 -translate-y-1/2 translate-x-3 whitespace-nowrap rounded-[var(--radius-lg)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] opacity-0 shadow-[0_16px_38px_-28px_rgba(15,23,42,0.55)] transition-opacity duration-150 group-hover:opacity-100"
                          style={{
                            background: "var(--navigation-tooltip-background)",
                            color: "var(--navigation-tooltip-foreground)",
                          }}
                        >
                          {t(`common.${labelKey}`)}
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
  const { t } = useTranslation();

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
      className="relative hidden h-full shrink-0 flex-col overflow-hidden border-r px-4 py-6 text-foreground md:flex"
      style={{
        borderColor: "var(--sidebar-border)",
        backgroundImage:
          "linear-gradient(160deg, var(--sidebar-glass-from) 0%, var(--sidebar-glass-to) 100%), url('/assets/brand/pattern-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        boxShadow: "var(--sidebar-glow)",
        backdropFilter: "blur(var(--glass-blur)) saturate(var(--glass-saturation))",
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute inset-0 bg-[radial-gradient(160%_140%_at_20%_-20%,var(--sidebar-accent)_0%,transparent_70%)] opacity-80" />
        <span className="absolute inset-0 bg-[radial-gradient(140%_140%_at_85%_0%,rgba(56,189,248,0.22)_0%,transparent_70%)] opacity-70 mix-blend-screen" />
        <span className="absolute inset-x-0 bottom-[-80px] h-44 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(255,255,255,0.14),transparent_80%)]" />
      </div>
      <div className="flex h-full flex-col gap-6">
        <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "justify-between")}>
          <motion.div layout className="flex items-center gap-3">
            <motion.div
              layout
              transition={sidebarSpring}
              className="flex items-center justify-center"
            >
              <span className="relative flex h-12 w-12 items-center justify-center rounded-[var(--radius-xl)] bg-[radial-gradient(circle_at_top,var(--navigation-icon-highlight),transparent_70%)] shadow-[0_22px_48px_-28px_rgba(59,130,246,0.38)] ring-1 ring-[color:var(--navigation-icon-ring)]">
                <img
                  src="/assets/brand/foda-icon.svg"
                  alt="Foda Elections icon"
                  className="h-7 w-7 drop-shadow-[0_16px_34px_rgba(124,58,237,0.42)]"
                />
              </span>
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
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
                    Foda Elections
                  </p>
                  <p className="bg-gradient-to-r from-[hsl(var(--header-title-from))] via-[hsl(var(--header-title-via))] to-[hsl(var(--header-title-to))] bg-clip-text text-sm font-semibold text-transparent">فوده مننا</p>
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
            style={{
              background: "var(--navigation-row-background)",
              border: "1px solid var(--navigation-row-border)",
              boxShadow: "var(--navigation-row-shadow)",
              backdropFilter: "blur(var(--glass-blur)) saturate(160%)",
            }}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ToggleIcon className="h-4 w-4" />
          </Button>
        </div>

        <SidebarNav isCollapsed={isCollapsed} />

        <div
          className="mt-auto rounded-[var(--radius-xl)] border border-dashed p-4 text-xs"
          style={{
            borderColor: "var(--navigation-row-border-active)",
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(14,165,233,0.12))",
            boxShadow: "var(--navigation-active-glow)",
          }}
        >
          <motion.div
            layout
            className={cn(
              "flex items-center gap-2 text-[color:var(--navigation-text)]",
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
                  {t("common.liveSync")}
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
                  <p className="text-sm font-semibold text-primary">{t("common.campaignPulseTitle")}</p>
                  <p className="text-xs leading-relaxed">{t("common.campaignPulseDescription")}</p>
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
                        <span>{t(`common.${key}`)}</span>
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
                  className="w-full justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[color:var(--navigation-text)]"
                  style={{
                    background: "var(--navigation-active-background)",
                    border: "1px solid var(--navigation-row-border-active)",
                    boxShadow: "var(--navigation-active-glow)",
                    backdropFilter: "blur(var(--glass-blur)) saturate(160%)",
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("common.newBriefing")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};
