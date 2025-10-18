import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BarDataPoint {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  title: string;
  subtitle?: string;
  data?: BarDataPoint[];
}

const defaultBarData: BarDataPoint[] = [
  { name: "يناير", value: 420 },
  { name: "فبراير", value: 380 },
  { name: "مارس", value: 512 },
  { name: "أبريل", value: 468 },
  { name: "مايو", value: 590 },
  { name: "يونيو", value: 640 },
];

export const BarChartComponent = ({ title, subtitle, data = defaultBarData }: BarChartComponentProps) => (
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
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <BarChart data={data} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="4 8" stroke="hsla(var(--border)/0.35)" vertical={false} />
            <XAxis dataKey="name" stroke="hsla(var(--foreground)/0.4)" tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "hsla(var(--primary)/0.08)" }}
              contentStyle={{
                borderRadius: 16,
                border: "1px solid hsla(var(--border)/0.2)",
                background: "hsla(var(--surface)/0.95)",
              }}
            />
            <Bar dataKey="value" fill="url(#barGradient)" radius={[12, 12, 12, 12]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.85} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.85} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

export default BarChartComponent;
