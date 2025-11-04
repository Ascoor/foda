import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { cn } from "@/infrastructure/shared/lib/utils";

export interface BarDataPoint {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  title: string;
  subtitle?: string;
  data?: BarDataPoint[];
  delay?: number;
}

const defaultBarData: BarDataPoint[] = [
  { name: "يناير", value: 420 },
  { name: "فبراير", value: 380 },
  { name: "مارس", value: 512 },
  { name: "أبريل", value: 468 },
  { name: "مايو", value: 590 },
  { name: "يونيو", value: 640 },
];

export const BarChartComponent = ({
  title,
  subtitle,
  data = defaultBarData,
  delay = 0,
}: BarChartComponentProps) => (
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
      <div className="absolute inset-0 bg-gradient-to-br from-[hsla(var(--primary)/0.12)] via-transparent to-[hsla(var(--accent)/0.14)] opacity-80" />
      <div className="absolute -top-24 right-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,_hsla(var(--accent)/0.25),_transparent_70%)] blur-3xl" />
    </div>

    <div className="relative z-10 space-y-6">
      <div className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[hsla(var(--primary)/0.12)] px-3 py-1 text-xs font-semibold text-[hsl(var(--primary))]">
          {subtitle ?? ("سجل الأعمال الميدانية" as string)}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <BarChart data={data} barGap={8} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="4 8"
              stroke="hsla(var(--border)/0.35)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="hsla(var(--foreground)/0.5)"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "hsla(var(--primary)/0.08)" }}
              contentStyle={{
                borderRadius: 18,
                border: "1px solid hsla(var(--border)/0.18)",
                background: "hsla(var(--surface)/0.92)",
              }}
            />
            <Bar
              dataKey="value"
              fill="url(#dashboard-bar-gradient)"
              radius={[14, 14, 14, 14]}
            />
            <defs>
              <linearGradient
                id="dashboard-bar-gradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.9}
                />

                <stop
                  offset="100%"
                  stopColor="hsl(var(--accent))"
                  stopOpacity={0.85}
                />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

export default BarChartComponent;
