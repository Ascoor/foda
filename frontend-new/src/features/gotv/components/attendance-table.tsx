import { GotvVoter } from "../services/gotv-service";

const priorityStyles: Record<GotvVoter["priority"], string> = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
};

type AttendanceTableProps = {
  voters: GotvVoter[];
  onToggle: (id: string, hasVoted: boolean) => void;
};

export const AttendanceTable = ({ voters, onToggle }: AttendanceTableProps) => (
  <section className="rounded-3xl bg-white shadow-lg dark:bg-slate-900">
    <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Turnout list</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Mark voters as soon as they arrive at the polls.</p>
      </div>
    </header>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
          <tr>
            <th className="px-6 py-3">Voter</th>
            <th className="px-6 py-3">Precinct</th>
            <th className="px-6 py-3">Priority</th>
            <th className="px-6 py-3">Contact</th>
            <th className="px-6 py-3">Has voted?</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {voters.map((voter) => (
            <tr key={voter.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <td className="px-6 py-4 text-slate-900 dark:text-slate-100">{voter.fullName}</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{voter.precinct}</td>
              <td className="px-6 py-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${priorityStyles[voter.priority]}`}>
                  {voter.priority}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{voter.phone ?? "—"}</td>
              <td className="px-6 py-4">
                <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={voter.hasVoted}
                    onChange={(event) => onToggle(voter.id, event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  {voter.hasVoted ? "Checked in" : "Waiting"}
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
