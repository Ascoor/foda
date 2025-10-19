import { VoterStatPoint } from "../services/analytics-service";

type VoterStatsChartProps = {
  data: VoterStatPoint[];
};

export const VoterStatsChart = ({ data }: VoterStatsChartProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Voter identification</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Supporters vs undecided voters by month.</p>

    <div className="mt-4 grid gap-4 md:grid-cols-4">
      {data.map((point) => (
        <div key={point.month} className="flex flex-col items-center gap-2">
          <div className="flex h-40 w-full flex-col justify-end gap-2">
            <div
              className="rounded-2xl bg-primary/80 p-2 text-center text-xs font-semibold text-white"
              style={{ height: `${Math.min(100, (point.supporters / 4000) * 100)}%` }}
            >
              {point.supporters}
            </div>
            <div
              className="rounded-2xl bg-amber-200/80 p-2 text-center text-xs font-semibold text-amber-900"
              style={{ height: `${Math.min(100, (point.undecided / 2000) * 100)}%` }}
            >
              {point.undecided}
            </div>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{point.month}</span>
        </div>
      ))}
    </div>
  </section>
);
