import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, Tooltip, YAxis } from "recharts";

import type { MetricsHistoryPoint, SystemMetrics } from "../hooks/use-ops";

interface SystemMetricsProps {
  metrics?: SystemMetrics;
  history: MetricsHistoryPoint[];
  isLoading?: boolean;
}

const metricFormatter = (value: number) => `${value.toFixed(1)}`;

export const SystemMetrics = ({ metrics, history, isLoading }: SystemMetricsProps) => {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
        <h2 className="text-base font-semibold">استقرار الواجهات البرمجية</h2>
        <p className="text-xs text-white/60">زمن الاستجابة وموثوقية الاتصالات</p>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="latency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="label" stroke="#cbd5f5" tickLine={false} />
              <YAxis stroke="#cbd5f5" tickLine={false} tickFormatter={metricFormatter} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.9)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: "0.75rem",
                }}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value: number) => `${value.toFixed(0)} مللي ثانية`}
              />
              <Area type="monotone" dataKey="apiLatencyMs" stroke="#60a5fa" fill="url(#latency)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-white/60">زمن الاستجابة</span>
            <span className="text-lg font-semibold">
              {isLoading ? "--" : `${metrics?.apiLatencyMs ?? 0} مللي ثانية`}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/60">متوسط الأخطاء</span>
            <span className="text-lg font-semibold">
              {isLoading ? "--" : `${metrics?.errorsPerMinute ?? 0}/دقيقة`}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
        <h2 className="text-base font-semibold">توافر القنوات الحية</h2>
        <p className="text-xs text-white/60">زمن اتصال المقار الانتخابية</p>
        <div className="mt-4 grid gap-4 text-sm">
          <div className="rounded-2xl bg-emerald-500/10 p-4">
            <span className="text-white/60">استمرارية الويب سوكيت</span>
            <p className="mt-2 text-2xl font-semibold">
              {isLoading ? "--" : `${metrics?.socketUptime ?? 0}%`}
            </p>
          </div>
          <div className="rounded-2xl bg-indigo-500/10 p-4">
            <span className="text-white/60">التعامل مع الحمل</span>
            <p className="mt-2 text-2xl font-semibold">
              {isLoading ? "--" : `${metrics?.throughputPerMinute ?? 0} طلب/دقيقة`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
