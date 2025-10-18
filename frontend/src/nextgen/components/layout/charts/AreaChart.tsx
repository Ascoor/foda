import { useMemo } from "react";
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { GlassCard } from "../GlassCard";

export type TrendPoint = {
  label: string;
  primary: number;
  secondary?: number;
};

interface AreaChartCardProps {
  title: string;
  description: string;
  data: TrendPoint[];
  emptyMessage: string;
  isLoading?: boolean;
}

const ChartSkeleton = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
  </div>
);

export const AreaChartCard = ({
  title,
  description,
  data,
  emptyMessage,
  isLoading = false,
}: AreaChartCardProps) => {
  const chartData = useMemo(
    () =>
      Array.isArray(data)
        ? data.map((point) => ({
            name: point.label,
            primary: Number.isFinite(point.primary) ? Number(point.primary) : 0,
            secondary: Number.isFinite(point.secondary ?? 0) ? Number(point.secondary ?? 0) : 0,
          }))
        : [],
    [data],
  );

  const hasData = chartData.length > 0 && chartData.some((point) => point.primary > 0 || point.secondary > 0);

  return (
    <GlassCard title={title} description={description}>
      <div className="h-[260px]">
        {isLoading ? (
          <ChartSkeleton />
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="name" stroke="rgba(15,23,42,0.4)" tickMargin={8} />
              <YAxis stroke="rgba(15,23,42,0.4)" tickMargin={8} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.9)",
                  borderRadius: 16,
                  border: "none",
                  color: "white",
                }}
              />
              <defs>
                <linearGradient id="primaryArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="secondaryArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="primary" stroke="#22d3ee" strokeWidth={3} fill="url(#primaryArea)" />
              <Area type="monotone" dataKey="secondary" stroke="#a855f7" strokeWidth={3} fill="url(#secondaryArea)" />
            </RechartsAreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-600 dark:text-slate-300">
            {emptyMessage}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
