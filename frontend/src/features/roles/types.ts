export type RoleScope = "system" | "election" | "committee";

export interface RoleRecord {
  id: number;
  name: string;
  scope: RoleScope;
  permissions: string[];
  permissions_json: Record<string, unknown> | null;
  auto_assign_rules: Record<string, unknown> | null;
  updated_at: string;
}

export interface RolesResponse {
  data: RoleRecord[];
  permissions: string[];
}
