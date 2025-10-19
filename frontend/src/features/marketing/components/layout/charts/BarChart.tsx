import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { GlassCard } from "../GlassCard";

const barData = [
  { name: "حملات رقمية", value: 28 },
  { name: "فعاليات ميدانية", value: 18 },
  { name: "شراكات", value: 12 },
  { name: "إعلام", value: 24 },
];

export const BarChartCard = () => (
  <GlassCard title="زخم الحملات" description="أثر الأنشطة المختلفة على الحملة.">
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={barData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.25)"
          />
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
          <Bar
            dataKey="value"
            radius={[16, 16, 12, 12]}
            fill="url(#barGradient)"
          />
          <defs>
            <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  </GlassCard>
);
