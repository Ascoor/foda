import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { GlassCard } from "../GlassCard";

const areaData = [
  { name: "Week 1", voters: 2400, engagement: 1200 },
  { name: "Week 2", voters: 3200, engagement: 1800 },
  { name: "Week 3", voters: 4000, engagement: 2600 },
  { name: "Week 4", voters: 5200, engagement: 3400 },
];

export const AreaChartCard = () => (
  <GlassCard
    title="تفاعل الناخبين"
    description="مقارنة بين نمو القاعدة الجماهيرية ومستوى التفاعل."
  >
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={areaData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.25)"
          />
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
            <linearGradient id="colorVoters" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="voters"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="url(#colorVoters)"
          />
          <Area
            type="monotone"
            dataKey="engagement"
            stroke="#a855f7"
            strokeWidth={3}
            fill="url(#colorEngagement)"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  </GlassCard>
);
