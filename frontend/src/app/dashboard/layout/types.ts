import type { GovernanceRole } from "../data/hierarchy";

export interface DashboardBreadcrumb {
  id: string;
  label: string;
  level?: "module" | "submodule" | "panel";
  path?: string;
  role?: GovernanceRole;
}
