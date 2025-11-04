import { motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/infrastructure/shared/lib/utils";

interface LineChartPoint {
  label: string;
  value: number;
}

interface LineChartComponentProps {
  title: string;
  data?: LineChartPoint[];
  subtitle?: string;
  delay?: number;
}

const defaultData: LineChartPoint[] = [
  { label: "يناير", value: 45 },
  { label: "فبراير", value: 52 },
  { label: "مارس", value: 61 },
  { label: "أبريل", value: 58 },
  { label: "مايو", value: 67 },
  { label: "يونيو", value: 73 },
];

export const LineChartComponent = ({
  title,
  data = defaultData,
  subtitle = "تطور التفاعل الشهري",
  delay = 0,
}: LineChartComponentProps) => (
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
      <div className="absolute -top-16 left-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,_hsla(var(--primary)/0.22),_transparent_70%)] blur-3xl" />
    </div>

    <div className="relative z-10 space-y-6">
      <div className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[hsla(var(--secondary)/0.14)] px-3 py-1 text-xs font-semibold text-[hsl(var(--secondary-foreground))]">
          {subtitle}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="4 8"
              stroke="hsla(var(--border)/0.3)"
            />
            <XAxis
              dataKey="label"
              stroke="hsla(var(--foreground)/0.5)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsla(var(--foreground)/0.5)"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 18,
                border: "1px solid hsla(var(--border)/0.18)",
                background: "hsla(var(--surface)/0.95)",
              }}
            />
            <defs>
              <linearGradient
                id="dashboard-line-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--accent))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#dashboard-line-gradient)"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--accent))", r: 5 }}
              activeDot={{
                r: 7,
                strokeWidth: 2,
                stroke: "hsl(var(--primary))",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

export default LineChartComponent;
