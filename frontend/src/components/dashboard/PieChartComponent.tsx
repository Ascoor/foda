import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PieDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartComponentProps {
  title: string;
  data?: PieDataPoint[];
}

const defaultData: PieDataPoint[] = [
  { name: "داعمون", value: 42, color: "#7E69AB" },
  { name: "محايدون", value: 27, color: "#3E82F7" },
  { name: "غير محدد", value: 18, color: "#0EA5E9" },
  { name: "يحتاج متابعة", value: 13, color: "#F97316" },
];

export const PieChartComponent = ({ title, data = defaultData }: PieChartComponentProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    className={cn(
      "relative overflow-hidden rounded-[28px] border",
      "border-[hsla(var(--border)/0.15)] bg-[hsla(var(--surface)/0.82)]",
      "p-6 shadow-[0_35px_90px_rgba(79,70,229,0.18)] backdrop-blur-2xl",
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--primary)/0.08)] via-transparent to-[hsla(var(--accent)/0.12)]" />
    <div className="relative space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">توزيع سريع حسب حالة الحملات</p>
      </div>
      <div className="aspect-square w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={entry.color ?? ["#7E69AB", "#3E82F7", "#0EA5E9", "#F97316"][index % 4]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid hsla(var(--border)/0.2)",
                background: "hsla(var(--surface)/0.95)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: entry.color ?? "#7E69AB" }}
            />
            <span className="flex-1">{entry.name}</span>
            <span className="font-semibold text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default PieChartComponent;
