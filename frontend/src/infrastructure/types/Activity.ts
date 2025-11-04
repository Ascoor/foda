import type { BaseEntity, Nullable } from "./common";

export type ActivityType =
  | "door_knock"
  | "phone_bank"
  | "rally"
  | "training"
  | "fundraising"
  | "digital";

export type ActivityStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Activity extends BaseEntity {
  campaign_uuid: string;
  type: ActivityType;
  status: ActivityStatus;
  title: string;
  description?: string | null;
  scheduled_for: string;
  duration_minutes?: number | null;
  location?: string | null;
  geo_area_uuid?: Nullable<string>;
  assigned_volunteer_uuids?: string[];
  metrics?: Record<string, number>;
}
