import { HeatMap } from "./components/heat-map";
import { VolunteerProgressChart } from "./components/volunteer-progress-chart";
import { VoterStatsChart } from "./components/voter-stats-chart";
import { useAnalytics } from "./hooks/use-analytics";

export const AnalyticsPage = () => {
  const { kpis, voterStats, volunteerProgress, heatMap } = useAnalytics();

  return (
    <div className="space-y-6 bg-gradient-to-br from-background via-white to-slate-100 p-6 dark:from-background-dark dark:via-slate-900 dark:to-slate-950">
      <header className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">Campaign analytics</h1>
        <p className="mt-1 text-sm opacity-80">High-level KPIs to guide field, finance, and voter contact.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <article key={kpi.id} className="rounded-3xl bg-white p-4 shadow-lg dark:bg-slate-900">
            <header className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{kpi.label}</h2>
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  kpi.trend === "up"
                    ? "text-emerald-600"
                    : kpi.trend === "down"
                      ? "text-rose-600"
                      : "text-slate-500"
                }`}
              >
                {kpi.delta}
              </span>
            </header>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{kpi.value}</p>
          </article>
        ))}
      </section>

      <VoterStatsChart data={voterStats} />
      <VolunteerProgressChart data={volunteerProgress} />
      <HeatMap data={heatMap} />
    </div>
  );
};
