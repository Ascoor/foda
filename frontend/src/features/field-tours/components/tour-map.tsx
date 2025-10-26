import { FieldTour } from "../services/field-tour-service";

const colors = ["bg-primary/10", "bg-emerald-100/60", "bg-amber-100/60", "bg-rose-100/60"];

type TourMapProps = {
  tours: FieldTour[];
};

export const TourMap = ({ tours }: TourMapProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Map overview</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Quick look at priority neighborhoods and canvass coverage.
    </p>

    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {tours.map((tour, index) => (
        <article key={tour.id} className={`rounded-2xl border border-slate-200 p-4 dark:border-slate-800 ${colors[index % colors.length]}`}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{tour.neighborhood}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{tour.name}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">{tour.date}</p>
        </article>
      ))}
      {tours.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No tours planned yet. Schedule one to see it on the map.
        </p>
      )}
    </div>
  </section>
);
