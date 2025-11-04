import type { Role } from "./Role";
import type { Permission } from "./Permission";
import type { Nullable, BaseEntity } from "./common";

export type UserStatus = "active" | "pending" | "invited" | "suspended";

export interface UserProfile {
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  preferred_locale?: string | null;
  timezone?: string | null;
}

export interface UserSettings {
  notifications_enabled: boolean;
  dark_mode: boolean;
  language: string;
}

export interface User extends BaseEntity {
  email: string;
  status: UserStatus;
  email_verified_at?: Nullable<string>;
  last_login_at?: Nullable<string>;
  profile?: UserProfile;
  settings?: UserSettings;
  roles: Role[];
  direct_permissions?: Permission[];
}
