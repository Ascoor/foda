import type { AuditLogEntry, SecurityAlert } from "../hooks/use-ops";

interface AuditLogProps {
  logs: AuditLogEntry[];
  alerts: SecurityAlert[];
  isLoading?: boolean;
}

export const AuditLog = ({ logs, alerts, isLoading }: AuditLogProps) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold">سجل العمليات</h2>
          <p className="text-xs text-white/60">أحدث التعديلات والإعدادات على المنصة</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-white/60">
          <span className="rounded-full bg-indigo-500/10 px-3 py-1">
            {alerts.length} تنبيه أمني
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1">
            {logs.length} حدث موثق
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {isLoading && (
          <div className="animate-pulse rounded-2xl bg-white/10 p-4 text-sm text-white/50">
            جارٍ تحميل السجل...
          </div>
        )}
        {!isLoading && !logs.length && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-center text-sm text-white/60">
            لا توجد نشاطات حديثة.
          </div>
        )}
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col gap-2 rounded-2xl bg-black/20 p-4 text-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold text-white/90">{log.actor}</p>
              <p className="text-white/70">{log.action}</p>
              <p className="text-xs text-white/50">{log.context}</p>
            </div>
            <div className="text-right text-xs text-white/50">
              <p>{new Intl.DateTimeFormat("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
              }).format(new Date(log.createdAt))}</p>
              {log.ipAddress && <p>IP: {log.ipAddress}</p>}
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-rose-200">تنبيهات أمنية مباشرة</h3>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-100"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{alert.message}</span>
                <span>
                  {new Intl.DateTimeFormat("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  }).format(new Date(alert.triggeredAt))}
                </span>
              </div>
              {alert.area && <p className="mt-1 text-rose-200/80">النطاق: {alert.area}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
