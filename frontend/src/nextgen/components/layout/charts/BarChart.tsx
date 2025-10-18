import { useMemo } from "react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { GlassCard } from "../GlassCard";

export type BarSegment = {
  label: string;
  value: number;
};

interface BarChartCardProps {
  title: string;
  description: string;
  data: BarSegment[];
  emptyMessage: string;
  isLoading?: boolean;
}

const ChartSkeleton = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
  </div>
);

export const BarChartCard = ({
  title,
  description,
  data,
  emptyMessage,
  isLoading = false,
}: BarChartCardProps) => {
  const chartData = useMemo(
    () =>
      Array.isArray(data)
        ? data
            .map((item) => ({
              name: item.label,
              value: Number.isFinite(item.value) ? Number(item.value) : 0,
            }))
            .filter((item) => item.value > 0)
        : [],
    [data],
  );

  const hasData = chartData.length > 0;

  return (
    <GlassCard title={title} description={description}>
      <div className="h-[260px]">
        {isLoading ? (
          <ChartSkeleton />
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="name" stroke="rgba(15,23,42,0.4)" tickMargin={8} />
              <YAxis stroke="rgba(15,23,42,0.4)" tickMargin={8} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.9)",
                  border: "none",
                  borderRadius: 16,
                  color: "white",
                }}
              />
              <Bar dataKey="value" radius={[16, 16, 12, 12]} fill="url(#barGradient)" />
              <defs>
                <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </RechartsBarChart>
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
