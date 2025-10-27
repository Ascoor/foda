import type { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TrendDatum {
  name: string;
  value: number;
}

interface TrendLineChartProps {
  data: TrendDatum[];
  stroke?: string;
  gradientId?: string;
}

export const TrendLineChart: FC<TrendLineChartProps> = ({
  data,
  stroke = "hsl(var(--primary))",
  gradientId = "trendLine",
}) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="5%" stopColor={stroke} stopOpacity={0.4} />
          <stop offset="95%" stopColor={stroke} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke="rgba(148, 163, 184, 0.25)" strokeDasharray="4 4" vertical={false} />
      <XAxis
        dataKey="name"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        stroke="rgba(15, 23, 42, 0.6)"
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tickMargin={12}
        stroke="rgba(15, 23, 42, 0.4)"
      />
      <Tooltip
        cursor={{ stroke: stroke, strokeOpacity: 0.2 }}
        contentStyle={{
          borderRadius: 16,
          border: "1px solid rgba(148, 163, 184, 0.3)",
          background: "rgba(255,255,255,0.95)",
        }}
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke={stroke}
        strokeWidth={3}
        dot={false}
        activeDot={{ r: 6, strokeWidth: 0 }}
        fill={`url(#${gradientId})`}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default TrendLineChart;
