import { AlertsPanel } from "./components/alerts-panel";
import { AttendanceTable } from "./components/attendance-table";
import { GotvDashboard } from "./components/gotv-dashboard";
import { useGotv } from "./hooks/use-gotv";

export const GotvPage = () => {
  const { voters, totals, markVoted } = useGotv();

  return (
    <div className="space-y-6 bg-gradient-to-br from-background via-white to-slate-100 p-6 dark:from-background-dark dark:via-slate-900 dark:to-slate-950">
      <header className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">GOTV Command</h1>
        <p className="mt-1 text-sm opacity-80">Track turnout in real time and triage support needs.</p>
      </header>

      <GotvDashboard totals={totals} />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AttendanceTable voters={voters} onToggle={markVoted} />
        <AlertsPanel />
      </div>
    </div>
  );
};
