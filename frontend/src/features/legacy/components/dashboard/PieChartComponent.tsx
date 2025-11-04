import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/infrastructure/shared/lib/utils";

export interface PieDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartComponentProps {
  title: string;
  data?: PieDataPoint[];
  delay?: number;
}

const defaultData: PieDataPoint[] = [
  { name: "داعمون", value: 42, color: "#7E69AB" },
  { name: "محايدون", value: 27, color: "#3E82F7" },
  { name: "غير محدد", value: 18, color: "#0EA5E9" },
  { name: "يحتاج متابعة", value: 13, color: "#F97316" },
];

export const PieChartComponent = ({
  title,
  data = defaultData,
  delay = 0,
}: PieChartComponentProps) => (
  <motion.div
    initial={{ opacity: 0, y: 22, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    className={cn(
      "relative overflow-hidden rounded-[28px] border",
      "border-[hsla(var(--border)/0.12)] bg-[hsla(var(--surface)/0.82)]",
      "p-6 shadow-[0_45px_95px_rgba(79,70,229,0.18)] backdrop-blur-2xl",
    )}
  >
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--primary)/0.12)] via-transparent to-[hsla(var(--accent)/0.16)] opacity-80" />
      <div className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_hsla(var(--primary)/0.28),_transparent_70%)] blur-3xl" />
    </div>

    <div className="relative z-10 space-y-6">
      <div className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[hsla(var(--accent)/0.14)] px-3 py-1 text-xs font-semibold text-[hsl(var(--accent))]">
          {"توزيع الحملات"}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground/80">
          توزيع سريع حسب حالة الحملات النشطة.
        </p>
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
                <Cell
                  key={entry.name}
                  fill={
                    entry.color ??
                    ["#7E69AB", "#3E82F7", "#0EA5E9", "#F97316"][index % 4]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 18,
                border: "1px solid hsla(var(--border)/0.18)",

                background: "hsla(var(--surface)/0.95)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
        {data.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center gap-2 rounded-2xl border border-[hsla(var(--border)/0.1)] bg-[hsla(var(--surface-secondary)/0.4)] px-3 py-2"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: entry.color ?? "#7E69AB" }}
            />

            <span className="flex-1 truncate text-foreground/90">
              {entry.name}
            </span>
            <span className="text-xs font-semibold text-foreground">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default PieChartComponent;
