import { useEffect, useState } from "react";
import { CampaignConfig, PermissionGroup, UserAccount, settingsService } from "../services/settings-service";

export const useSettings = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [config, setConfig] = useState<CampaignConfig | null>(null);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);

  useEffect(() => {
    const load = async () => {
      const [userList, configValue, permissionList] = await Promise.all([
        settingsService.listUsers(),
        settingsService.getCampaignConfig(),
        settingsService.listPermissionGroups(),
      ]);

      setUsers(userList);
      setConfig(configValue);
      setPermissionGroups(permissionList);
    };

    load();
  }, []);

  return {
    users,
    config,
    permissionGroups,
  };
};
