import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { GlassCard } from "../GlassCard";

const pieData = [
  { name: "المنصورة", value: 38 },
  { name: "ميت غمر", value: 24 },
  { name: "السنبلاوين", value: 21 },
  { name: "طلخا", value: 17 },
];

const COLORS = ["#22d3ee", "#34d399", "#a855f7", "#f472b6"];

export const PieChartCard = () => (
  <GlassCard
    title="توزيع الأصوات"
    description="نسبة الأصوات حسب المراكز الرئيسية."
  >
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={pieData}
            dataKey="value"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={8}
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
              />
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
    </div>
  </GlassCard>
);
