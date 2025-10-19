import { Donation } from "../services/donation-service";

const methodLabels: Record<Donation["method"], string> = {
  cash: "Cash",
  card: "Card",
  check: "Check",
  online: "Online",
};

type DonationListProps = {
  donations: Donation[];
};

export const DonationList = ({ donations }: DonationListProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent donations</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track offline fundraising and compliance notes.</p>

    <div className="mt-4 space-y-4">
      {donations.map((donation) => (
        <article key={donation.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{donation.donorName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{methodLabels[donation.method]} • {donation.date}</p>
            </div>
            <span className="text-xl font-bold text-primary">${donation.amount.toFixed(2)}</span>
          </div>
          {donation.notes && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{donation.notes}</p>}
        </article>
      ))}

      {donations.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No donations recorded yet. Add a gift to get started.
        </p>
      )}
    </div>
  </section>
);
