import { PermissionGroup } from "../services/settings-service";

type PermissionsControlProps = {
  groups: PermissionGroup[];
};

export const PermissionsControl = ({ groups }: PermissionsControlProps) => (
  <section className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Permissions</h2>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review which roles can access sensitive areas.</p>

    <div className="mt-4 space-y-3">
      {groups.map((group) => (
        <article key={group.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{group.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{group.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.roles.map((role) => (
              <span key={role} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {role}
              </span>
            ))}
          </div>
        </article>
      ))}

      {groups.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No permission groups defined.
        </p>
      )}
    </div>
  </section>
);
