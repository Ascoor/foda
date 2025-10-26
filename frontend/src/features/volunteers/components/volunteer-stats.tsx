import { VolunteerStats } from "../types";

const statCards: { key: keyof VolunteerStats; label: string }[] = [
  { key: "total", label: "Total" },
  { key: "active", label: "Active" },
  { key: "training", label: "In training" },
  { key: "inactive", label: "Inactive" },
];

type VolunteerStatsProps = {
  stats: VolunteerStats;
};

export const VolunteerStats = ({ stats }: VolunteerStatsProps) => (
  <section className="grid gap-4 md:grid-cols-4">
    {statCards.map((card) => (
      <article key={card.key} className="rounded-3xl bg-primary/10 p-4 text-primary shadow">
        <h3 className="text-xs font-semibold uppercase tracking-wide opacity-80">{card.label}</h3>
        <p className="mt-2 text-2xl font-bold">{stats[card.key]}</p>
      </article>
    ))}
    <article className="rounded-3xl bg-emerald-100/80 p-4 text-emerald-800 shadow dark:bg-emerald-500/10 dark:text-emerald-200">
      <h3 className="text-xs font-semibold uppercase tracking-wide opacity-80">Hours this week</h3>
      <p className="mt-2 text-2xl font-bold">{stats.hoursThisWeek}</p>
    </article>
  </section>
);
