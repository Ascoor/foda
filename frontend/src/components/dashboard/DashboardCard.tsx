import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  trendLabel?: string;
  icon?: LucideIcon;
  footer?: ReactNode;
}

export const DashboardCard = ({
  title,
  value,
  description,
  trend,
  trendLabel,
  icon: Icon,
  footer,
}: DashboardCardProps) => {
  const TrendIcon = trend && trend < 0 ? ArrowDownRight : ArrowUpRight;
  const trendValue = trend ?? 0;
  const trendIsPositive = trendValue >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[28px] border",
        "border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)]",
        "shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl",
        "p-6 sm:p-8",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--primary)/0.08)] via-transparent to-[hsla(var(--accent)/0.1)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-foreground sm:text-4xl">{value}</span>
            {trend !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                  trendIsPositive
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-rose-500/10 text-rose-500",
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {Math.abs(trendValue).toLocaleString("ar-EG")}%
              </span>
            )}
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsla(var(--primary)/0.12)] text-[hsl(var(--primary))] shadow-inner shadow-[hsla(var(--primary)/0.2)]">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      {trendLabel && (
        <p className="mt-6 text-xs text-muted-foreground">{trendLabel}</p>
      )}
      {footer && <div className="mt-6 border-t border-[hsla(var(--border)/0.1)] pt-4 text-sm text-muted-foreground">{footer}</div>}
    </motion.div>
  );
};

export default DashboardCard;
