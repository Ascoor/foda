import { motion } from "framer-motion";
import { AlertsPanel } from "./components/alerts-panel";
import { AttendanceTable } from "./components/attendance-table";
import { GotvDashboard } from "./components/gotv-dashboard";
import { useGotv } from "./hooks/use-gotv";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const GOTVPage = () => {
  const { voters, totals, markVoted, isLoading } = useGotv();

  return (
    <motion.div {...pageMotion} transition={{ duration: 0.3 }} className="space-y-6">
      <section className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">GOTV Command</h1>
        <p className="mt-1 text-sm opacity-80">
          Track turnout in real time and triage support needs.
        </p>
      </section>

      <GotvDashboard totals={totals} />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AttendanceTable voters={voters} onToggle={markVoted} isLoading={isLoading} />
        <AlertsPanel />
      </div>
    </motion.div>
  );
};
