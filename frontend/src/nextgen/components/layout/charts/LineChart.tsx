import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { GlassCard } from "../GlassCard";

export type TurnoutPoint = {
  label: string;
  turnout: number;
  momentum?: number;
};

interface LineChartCardProps {
  title: string;
  description: string;
  data: TurnoutPoint[];
  emptyMessage: string;
  isLoading?: boolean;
}

const ChartSkeleton = () => (
  <div className="flex h-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
  </div>
);

export const LineChartCard = ({
  title,
  description,
  data,
  emptyMessage,
  isLoading = false,
}: LineChartCardProps) => {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((point, index) => {
      const safeTurnout = Number.isFinite(point.turnout) ? Number(point.turnout) : 0;
      const previousTurnout = index > 0 && Number.isFinite(data[index - 1]?.turnout)
        ? Number(data[index - 1].turnout)
        : safeTurnout;
      const derivedMomentum = safeTurnout - previousTurnout;
      const safeMomentum = Number.isFinite(point.momentum ?? derivedMomentum)
        ? Number(point.momentum ?? derivedMomentum)
        : 0;

      return {
        name: point.label,
        turnout: safeTurnout,
        momentum: safeMomentum,
      };
    });
  }, [data]);

  const hasData = chartData.length > 0;

  return (
    <GlassCard title={title} description={description}>
      <div className="h-[260px]">
        {isLoading ? (
          <ChartSkeleton />
        ) : hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis dataKey="name" stroke="rgba(15,23,42,0.4)" tickMargin={8} />
              <YAxis stroke="rgba(15,23,42,0.4)" tickMargin={8} />
              <Tooltip
                contentStyle={{
                  background: "rgba(30, 41, 59, 0.85)",
                  borderRadius: 16,
                  border: "none",
                  color: "white",
                }}
              />
              <Line type="monotone" dataKey="turnout" stroke="#22d3ee" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="momentum" stroke="#a855f7" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
            </RechartsLineChart>
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
