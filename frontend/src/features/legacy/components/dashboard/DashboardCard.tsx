import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/infrastructure/shared/lib/utils";

interface DashboardCardProps {
  title: string;
  value?: string | number;
  description?: string;
  trend?: number;
  trendLabel?: string;
  icon?: LucideIcon;
  footer?: ReactNode;
  delay?: number;
}

export const DashboardCard = ({
  title,
  value,
  description,
  trend,
  trendLabel,
  icon: Icon,
  footer,
  delay = 0,
}: DashboardCardProps) => {
  const trendValue = trend ?? 0;
  const isPositive = trendValue >= 0;
  const TrendIcon = trendValue < 0 ? ArrowDownRight : ArrowUpRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={cn(
        "group relative overflow-hidden rounded-[26px] border",
        "border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.78)]",
        "shadow-[0_45px_95px_rgba(79,70,229,0.18)] backdrop-blur-2xl",
        "p-6 sm:p-7",
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--primary)/0.14)] via-transparent to-[hsla(var(--accent)/0.16)] opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute -bottom-10 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_hsla(var(--primary)/0.25),_transparent_70%)] blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
              {title}
            </p>
            {value !== undefined && (
              <motion.div layout className="flex items-baseline gap-3">
                <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(var(--primary))] bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </span>
                {trend !== undefined && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                      isPositive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-400",
                    )}
                  >
                    <TrendIcon className="h-3.5 w-3.5" />
                    {Math.abs(trendValue).toLocaleString("ar-EG")}%
                  </span>
                )}
              </motion.div>
            )}
            {description && (
              <p className="text-sm text-muted-foreground/90">{description}</p>
            )}
          </div>
          {Icon && (
            <motion.div
              layout
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsla(var(--primary)/0.16)] text-[hsl(var(--primary))] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
            >
              <Icon className="h-6 w-6" />
              <motion.span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          )}
        </div>

        {trendLabel && (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
            {trendLabel}
          </p>
        )}

        {footer && (
          <div className="rounded-2xl border border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface-secondary)/0.4)] p-4 text-sm text-muted-foreground">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
