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

const lineData = [
  { name: "8 AM", turnout: 12, momentum: 8 },
  { name: "10 AM", turnout: 22, momentum: 14 },
  { name: "12 PM", turnout: 34, momentum: 25 },
  { name: "2 PM", turnout: 46, momentum: 32 },
  { name: "4 PM", turnout: 59, momentum: 40 },
  { name: "6 PM", turnout: 67, momentum: 52 },
];

export const LineChartCard = () => (
  <GlassCard
    title="منحنى المشاركة"
    description="تطور نسبة التصويت على مدار اليوم."
  >
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={lineData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.25)"
          />
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
          <Line
            type="monotone"
            dataKey="turnout"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="momentum"
            stroke="#a855f7"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  </GlassCard>
);
