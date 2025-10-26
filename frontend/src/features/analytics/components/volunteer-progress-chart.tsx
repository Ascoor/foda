import { VolunteerProgressPoint } from "../services/analytics-service";

type VolunteerProgressChartProps = {
  data: VolunteerProgressPoint[];
};

export const VolunteerProgressChart = ({ data }: VolunteerProgressChartProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Volunteer pipeline</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Training completion vs active shift participation.</p>

    <div className="mt-4 space-y-3">
      {data.map((point) => (
        <article key={point.week} className="space-y-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
            <span>{point.week}</span>
            <span>{point.active} active</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(100, (point.trained / 120) * 100)}%` }} />
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (point.active / 120) * 100)}%` }} />
          </div>
        </article>
      ))}
    </div>
  </section>
);
