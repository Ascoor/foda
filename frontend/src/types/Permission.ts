import type { BaseEntity } from "./common";

export type PermissionAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "export"
  | "assign";

export interface Permission extends BaseEntity {
  name: string;
  slug: string;
  module: string;
  description?: string | null;
  action: PermissionAction;
}
