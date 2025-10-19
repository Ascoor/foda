import { motion } from "framer-motion";
import { DonationForm } from "./components/donation-form";
import { DonationList } from "./components/donation-list";
import { DonationSummary } from "./components/donation-summary";
import { useDonations } from "./hooks/use-donations";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const DonationsPage = () => {
  const { donations, summary, addDonation } = useDonations();

  return (
    <motion.div {...pageMotion} transition={{ duration: 0.3 }} className="space-y-6">
      <section className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">Finance Desk</h1>
        <p className="mt-1 text-sm opacity-80">
          Capture field donations and monitor manual entries.
        </p>
      </section>

      <DonationSummary summary={summary} />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <DonationForm onSubmit={addDonation} />
        <DonationList donations={donations} />
      </div>
    </motion.div>
  );
};
