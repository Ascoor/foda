import { DonationForm } from "./components/donation-form";
import { DonationList } from "./components/donation-list";
import { DonationSummary } from "./components/donation-summary";
import { useDonations } from "./hooks/use-donations";

export const DonationsPage = () => {
  const { donations, summary, addDonation } = useDonations();

  return (
    <div className="space-y-6 bg-gradient-to-br from-background via-white to-slate-100 p-6 dark:from-background-dark dark:via-slate-900 dark:to-slate-950">
      <header className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">Finance Desk</h1>
        <p className="mt-1 text-sm opacity-80">Capture field donations and monitor manual entries.</p>
      </header>

      <DonationSummary summary={summary} />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <DonationForm onSubmit={addDonation} />
        <DonationList donations={donations} />
      </div>
    </div>
  );
};
