import { ReactNode } from "react";

export type DonationSummaryData = {
  total: number;
  average: number;
  count: number;
};

const SummaryCard = ({ label, value, children }: { label: string; value: string; children?: ReactNode }) => (
  <article className="rounded-3xl bg-primary/10 p-4 text-primary shadow">
    <h3 className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</h3>
    <p className="mt-2 text-2xl font-bold">{value}</p>
    {children && <p className="mt-1 text-xs opacity-70">{children}</p>}
  </article>
);

type DonationSummaryProps = {
  summary: DonationSummaryData;
};

export const DonationSummary = ({ summary }: DonationSummaryProps) => (
  <section className="grid gap-4 md:grid-cols-3">
    <SummaryCard label="Total raised" value={`$${summary.total.toFixed(2)}`}>All manually recorded contributions.</SummaryCard>
    <SummaryCard label="Average gift" value={`$${summary.average.toFixed(2)}`}>Per entry.</SummaryCard>
    <SummaryCard label="Entries" value={`${summary.count}`}>Manual records this cycle.</SummaryCard>
  </section>
);
