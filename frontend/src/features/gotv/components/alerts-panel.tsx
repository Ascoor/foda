import { useMemo } from "react";
import { useNotifications } from "@/shared/contexts/notification-context";

const severityStyles: Record<string, string> = {
  high: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
  low: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-slate-200",
};

export const AlertsPanel = () => {
  const { notifications } = useNotifications();

  const alerts = useMemo(
    () =>
      notifications.filter(
        (notification) => notification.type === "field" || notification.priority !== "low",
      ),
    [notifications],
  );

  return (
    <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Alerts</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Triage tasks to keep your GOTV operation moving.
      </p>

      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className={`rounded-2xl border p-4 ${severityStyles[alert.priority] ?? severityStyles.low}`}
          >
            <h3 className="text-lg font-semibold">{alert.title}</h3>
            <p className="text-sm">{alert.message}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {alert.category} · {new Date(alert.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </article>
        ))}

        {alerts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No alerts at the moment. Great work!
          </p>
        )}
      </div>
    </section>
  );
};
