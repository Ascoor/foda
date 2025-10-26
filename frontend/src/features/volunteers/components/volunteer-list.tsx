import { Volunteer, VolunteerStatus } from "../services/volunteer-service";
import { Button } from "@/shared/ui";

const statusStyles: Record<VolunteerStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
  training: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200",
  inactive: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
};

type VolunteerListProps = {
  volunteers: Volunteer[];
  isLoading?: boolean;
  onUpdateStatus?: (id: string, status: VolunteerStatus) => void;
};

export const VolunteerList = ({ volunteers, isLoading = false, onUpdateStatus }: VolunteerListProps) => (
  <section className="rounded-3xl bg-white shadow-lg dark:bg-slate-900">
    <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Volunteer roster</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage availability, skills, and active status.</p>
      </div>
      <Button variant="outline" className="rounded-2xl border-dashed px-4 py-2 text-xs font-semibold uppercase tracking-wide">
        Import CSV
      </Button>
    </header>

    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {isLoading ? (
        <div className="px-6 py-6 text-sm text-slate-500 dark:text-slate-400">Loading volunteers…</div>
      ) : volunteers.length === 0 ? (
        <div className="px-6 py-6 text-sm text-slate-500 dark:text-slate-400">No volunteers yet. Add your first teammate!</div>
      ) : (
        volunteers.map((volunteer) => (
          <article key={volunteer.id} className="flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{volunteer.fullName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {volunteer.neighborhood} • {volunteer.availability}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {volunteer.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {skill}
                  </span>
                ))}
                {volunteer.assignedTasks.map((task) => (
                  <span
                    key={task}
                    className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {task}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 text-sm text-slate-500 dark:text-slate-400 md:items-end">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[volunteer.status]}`}>
                {volunteer.status}
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{volunteer.hoursThisWeek} hrs this week</span>
              <div className="flex items-center gap-2">
                <select
                  value={volunteer.status}
                  onChange={(event) => onUpdateStatus?.(volunteer.id, event.target.value as VolunteerStatus)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {Object.keys(statusStyles).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <Button variant="ghost" className="rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                  Message
                </Button>
              </div>
              {(volunteer.phone || volunteer.email) && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {volunteer.phone && <div>☎ {volunteer.phone}</div>}
                  {volunteer.email && <div>✉ {volunteer.email}</div>}
                </div>
              )}
            </div>
          </article>
        ))
      )}
    </div>
  </section>
);
