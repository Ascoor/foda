import { HeatMapCell } from "../services/analytics-service";

type HeatMapProps = {
  data: HeatMapCell[];
};

const getIntensityClass = (value: number) => {
  if (value >= 0.8) return "bg-emerald-500/80 text-white";
  if (value >= 0.7) return "bg-emerald-300/80 text-emerald-900";
  if (value >= 0.6) return "bg-amber-200/80 text-amber-900";
  return "bg-rose-200/80 text-rose-900";
};

export const HeatMap = ({ data }: HeatMapProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Heat map</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Contact rate by neighborhood.</p>

    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {data.map((cell) => (
        <article key={cell.neighborhood} className={`rounded-2xl p-4 text-center text-sm font-semibold ${getIntensityClass(cell.contactRate)}`}>
          <div className="text-xs uppercase tracking-wide opacity-80">{cell.neighborhood}</div>
          <div className="text-2xl">{Math.round(cell.contactRate * 100)}%</div>
        </article>
      ))}
    </div>
  </section>
);
