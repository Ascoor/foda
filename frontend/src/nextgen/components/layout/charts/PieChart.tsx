import { useMemo } from "react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";
import { GlassCard } from "../GlassCard";

export type DistributionSlice = {
  label: string;
  value: number;
};

interface PieChartCardProps {
  title: string;
  description: string;
  data: DistributionSlice[];
  emptyMessage: string;
  isLoading?: boolean;
}

const COLORS = ["#22d3ee", "#34d399", "#a855f7", "#f472b6"];

const ChartSkeleton = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
  </div>
);

export const PieChartCard = ({
  title,
  description,
  data,
  emptyMessage,
  isLoading = false,
}: PieChartCardProps) => {
  const chartData = useMemo(
    () =>
      Array.isArray(data)
        ? data
            .map((slice) => ({
              name: slice.label,
              value: Number.isFinite(slice.value) ? Number(slice.value) : 0,
            }))
            .filter((slice) => slice.value > 0)
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
            <RechartsPieChart>
              <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={8}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.8)",
                  borderRadius: 16,
                  border: "none",
                  color: "white",
                }}
              />
            </RechartsPieChart>
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
