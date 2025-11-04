import type { Permission } from "./Permission";
import type { BaseEntity } from "./common";

export type RoleScope = "system" | "organization" | "campaign";

export interface Role extends BaseEntity {
  name: string;
  slug: string;
  description?: string | null;
  scope: RoleScope;
  permissions: Permission[];
  is_default: boolean;
}
