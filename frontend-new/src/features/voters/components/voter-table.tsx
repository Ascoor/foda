import { Voter, VoterStatus } from "../services/voter-service";
import { Button } from "@/shared/ui";

const statusStyles: Record<VoterStatus, string> = {
  supporter: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
  leaning: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
  undecided: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
  opposed: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200",
  unknown: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

type VoterTableProps = {
  voters: Voter[];
  isLoading?: boolean;
  onSelectVoter?: (id: string) => void;
  onUpdateStatus?: (id: string, status: VoterStatus) => void;
};

export const VoterTable = ({ voters, isLoading = false, onSelectVoter, onUpdateStatus }: VoterTableProps) => (
  <section className="overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-slate-900">
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Voter Universe</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Segmented view of people contacted in the campaign.</p>
      </div>
      <Button variant="outline" className="rounded-2xl border-dashed">
        Export CSV
      </Button>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Precinct</th>
            <th className="px-6 py-3">Support score</th>
            <th className="px-6 py-3">Preferred contact</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Last contact</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                Loading voters…
              </td>
            </tr>
          ) : voters.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                No voters match the current filters.
              </td>
            </tr>
          ) : (
            voters.map((voter) => (
              <tr key={voter.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-slate-100">{voter.fullName}</div>
                  {voter.address && <div className="text-xs text-slate-500 dark:text-slate-400">{voter.address}</div>}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{voter.precinct}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <span className="font-semibold">{voter.likelihoodScore}</span>
                    <span className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
                      <span
                        className="block h-2 rounded-full bg-primary"
                        style={{ width: `${Math.max(10, voter.likelihoodScore)}%` }}
                      />
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize text-slate-700 dark:text-slate-200">{voter.preferredContact.replace("-", " ")}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[voter.status]}`}>
                    {voter.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{voter.lastContacted ?? "—"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      aria-label="Update voter status"
                      value={voter.status}
                      onChange={(event) => onUpdateStatus?.(voter.id, event.target.value as VoterStatus)}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {Object.keys(statusStyles).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      className="rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wide"
                      onClick={() => onSelectVoter?.(voter.id)}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);
