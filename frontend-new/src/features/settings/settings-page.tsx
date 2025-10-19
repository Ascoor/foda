import { motion } from "framer-motion";
import { CampaignConfigPanel } from "./components/campaign-config";
import { PermissionsControl } from "./components/permissions-control";
import { UsersManagement } from "./components/users-management";
import { useSettings } from "./hooks/use-settings";

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const SettingsPage = () => {
  const { users, config, permissionGroups } = useSettings();

  return (
    <motion.div {...pageMotion} transition={{ duration: 0.3 }} className="space-y-6">
      <section className="rounded-3xl bg-primary/10 p-6 text-primary shadow">
        <h1 className="text-3xl font-bold">Campaign settings</h1>
        <p className="mt-1 text-sm opacity-80">Manage access, defaults, and compliance details.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <UsersManagement users={users} />
        <div className="space-y-6">
          <CampaignConfigPanel config={config} />
          <PermissionsControl groups={permissionGroups} />
        </div>
      </div>
    </motion.div>
  );
};
