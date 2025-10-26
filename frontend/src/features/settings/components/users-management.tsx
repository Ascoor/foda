import { UserAccount } from "../services/settings-service";

const roleLabels: Record<UserAccount["role"], string> = {
  admin: "Admin",
  organizer: "Organizer",
  volunteer: "Volunteer",
};

type UsersManagementProps = {
  users: UserAccount[];
};

export const UsersManagement = ({ users }: UsersManagementProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">User accounts</h2>
      <button className="rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Invite user
      </button>
    </div>

    <div className="mt-4 space-y-3">
      {users.map((user) => (
        <article key={user.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{user.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{roleLabels[user.role]}</span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{user.status}</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);
