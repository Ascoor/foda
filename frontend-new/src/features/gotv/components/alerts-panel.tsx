const alerts = [
  {
    id: "transport",
    title: "Need rides",
    description: "3 high-priority voters requested transportation assistance.",
    severity: "high",
  },
  {
    id: "poll-worker",
    title: "Poll observer",
    description: "Volunteer needed for Riverfront precinct 4 from 3-6pm.",
    severity: "medium",
  },
];

const severityStyles: Record<string, string> = {
  high: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200",
  medium: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
};

export const AlertsPanel = () => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Alerts</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Triage tasks to keep your GOTV operation moving.</p>

    <div className="mt-4 space-y-3">
      {alerts.map((alert) => (
        <article key={alert.id} className={`rounded-2xl border p-4 ${severityStyles[alert.severity]}`}>
          <h3 className="text-lg font-semibold">{alert.title}</h3>
          <p className="text-sm">{alert.description}</p>
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
