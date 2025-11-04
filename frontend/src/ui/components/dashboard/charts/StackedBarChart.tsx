import type { FC } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface StackedBarDatum {
  name: string;
  valueA: number;
  valueB: number;
}

interface StackedBarChartProps {
  data: StackedBarDatum[];
  series?: { key: keyof StackedBarDatum; label: string; color: string }[];
}

const defaultSeries = [
  { key: "valueA" as const, label: "Series A", color: "hsl(var(--primary))" },
  { key: "valueB" as const, label: "Series B", color: "hsl(var(--secondary))" },
];

export const StackedBarChart: FC<StackedBarChartProps> = ({
  data,
  series = defaultSeries,
}) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
      <XAxis dataKey="name" stroke="rgba(15, 23, 42, 0.6)" tickLine={false} axisLine={false} />
      <YAxis stroke="rgba(15, 23, 42, 0.4)" tickLine={false} axisLine={false} />
      <Tooltip
        cursor={{ fill: "rgba(15, 23, 42, 0.05)" }}
        contentStyle={{
          borderRadius: 16,
          border: "1px solid rgba(148,163,184,0.3)",
          background: "rgba(255,255,255,0.95)",
        }}
      />
      <Legend
        wrapperStyle={{ paddingTop: 12 }}
        iconType="circle"
        formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
      />
      {series.map((serie) => (
        <Bar
          key={serie.key as string}
          dataKey={serie.key as string}
          name={serie.label}
          stackId="total"
          fill={serie.color}
          radius={[12, 12, 0, 0]}
          barSize={18}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

export default StackedBarChart;
