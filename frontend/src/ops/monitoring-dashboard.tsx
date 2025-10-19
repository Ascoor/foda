import { useMemo } from "react";

import { SystemMetrics } from "./components/system-metrics";
import { AuditLog } from "./components/audit-log";
import { useOps } from "./hooks/use-ops";

export const MonitoringDashboard = () => {
  const { metrics, metricsHistory, logs, alerts, isLoading, refresh, lastUpdated } = useOps();

  const healthStatus = useMemo(() => {
    if (!metrics) return "جارٍ التحميل";
    if (metrics.errorsPerMinute > 10 || metrics.apiLatencyMs > 1500) {
      return "🔴 مراقبة عاجلة";
    }
    if (metrics.errorsPerMinute > 5) {
      return "🟠 يتطلب انتباها";
    }
    return "🟢 مستقر";
  }, [metrics]);

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/60">لوحة العمليات</p>
          <h1 className="text-2xl font-bold">المراقبة اللحظية</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full bg-white/10 px-4 py-2 font-semibold">{healthStatus}</span>
          {lastUpdated && (
            <span className="rounded-full bg-white/5 px-4 py-2">
              آخر تحديث {new Intl.DateTimeFormat("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(lastUpdated))}
            </span>
          )}
          <button
            onClick={() => void refresh()}
            className="rounded-full bg-indigo-500/20 px-4 py-2 font-semibold text-indigo-100 transition hover:bg-indigo-500/30"
          >
            تحديث البيانات
          </button>
        </div>
      </header>

      <SystemMetrics metrics={metrics} history={metricsHistory} isLoading={isLoading.metrics} />

      <AuditLog logs={logs} alerts={alerts} isLoading={isLoading.logs} />
    </div>
  );
};
