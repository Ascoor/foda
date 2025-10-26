import { Totals } from "../types";

type GotvDashboardProps = {
  totals: Totals;
};

const cards: { key: keyof Totals; label: string }[] = [
  { key: "total", label: "Universe" },
  { key: "voted", label: "Voted" },
  { key: "remaining", label: "Remaining" },
  { key: "highPriority", label: "High priority" },
];

export const GotvDashboard = ({ totals }: GotvDashboardProps) => (
  <section className="grid gap-4 md:grid-cols-4">
    {cards.map((card) => (
      <article key={card.key} className="rounded-3xl bg-primary/10 p-4 text-primary shadow">
        <h3 className="text-xs font-semibold uppercase tracking-wide opacity-80">{card.label}</h3>
        <p className="mt-2 text-2xl font-bold">{totals[card.key]}</p>
      </article>
    ))}
  </section>
);
