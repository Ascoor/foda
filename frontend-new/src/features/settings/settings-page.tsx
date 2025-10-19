import { CampaignConfigPanel } from "./components/campaign-config";
import { PermissionsControl } from "./components/permissions-control";
import { UsersManagement } from "./components/users-management";
import { useSettings } from "./hooks/use-settings";

export const SettingsPage = () => {
  const { users, config, permissionGroups } = useSettings();

  return (
    <div className="space-y-6 bg-gradient-to-br from-background via-white to-slate-100 p-6 dark:from-background-dark dark:via-slate-900 dark:to-slate-950">
      <header className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">Campaign settings</h1>
        <p className="mt-1 text-sm opacity-80">Manage access, defaults, and compliance details.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <UsersManagement users={users} />
        <div className="space-y-6">
          <CampaignConfigPanel config={config} />
          <PermissionsControl groups={permissionGroups} />
        </div>
      </div>
    </div>
  );
};
