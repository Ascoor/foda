import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";

export interface StatMetric {
  key: string;
  label: string;
  value: number;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  color: "primary" | "secondary" | "accent" | "success";
}

interface StatsOverviewProps {
  metrics: StatMetric[];
  loading: boolean;
}

const StatsOverviewComponent = ({ metrics, loading }: StatsOverviewProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={`skeleton-${index}`}
            className="h-32 rounded-[var(--radius-2xl)] bg-white/20 dark:bg-white/10"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatsCard
          key={metric.key}
          title={metric.label}
          value={metric.value.toLocaleString()}
          change={metric.change ?? "0%"}
          trend={metric.trend ?? "up"}
          icon={metric.icon}
          color={metric.color}
        />
      ))}
    </div>
  );
};

export const StatsOverview = memo(StatsOverviewComponent);
