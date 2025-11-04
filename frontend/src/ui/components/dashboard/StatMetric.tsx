import { TrendingDown, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";

import { cn } from "@/infrastructure/shared/lib/utils";
import { DashboardCard } from "./DashboardCard";

export type StatTone = "primary" | "secondary" | "success" | "warning";

const toneClasses: Record<StatTone, string> = {
  primary: "from-[hsla(var(--primary)/0.12)] to-[hsla(var(--accent)/0.12)] text-[hsl(var(--primary))]",
  secondary: "from-[hsla(var(--secondary)/0.12)] to-[hsla(var(--accent)/0.12)] text-[hsl(var(--secondary))]",
  success: "from-green-500/15 to-emerald-500/15 text-emerald-600",
  warning: "from-amber-500/15 to-orange-500/15 text-amber-600",
};

export interface StatMetricProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  tone?: StatTone;
  icon?: ComponentType<{ className?: string }>;
  footer?: string;
}

export const StatMetric = ({
  label,
  value,
  change,
  trend = "up",
  tone = "primary",
  icon: Icon,
  footer,
}: StatMetricProps) => {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <DashboardCard className="h-full">
      <div className="relative flex h-full flex-col justify-between gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground/70">
              {label}
            </span>
            <span className="text-3xl font-semibold text-foreground lg:text-4xl">
              {formattedValue}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl bg-gradient-to-br px-3 py-2 text-xs font-semibold shadow-sm",
              toneClasses[tone],
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {change ?? "—"}
          </div>
        </div>

        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsla(var(--primary)/0.12)] text-[hsl(var(--primary))]">
            <Icon className="h-5 w-5" />
          </div>
        )}

        {footer && (
          <div className="text-xs text-muted-foreground/80">{footer}</div>
        )}
      </div>
    </DashboardCard>
  );
};

export default StatMetric;
