import type { BaseEntity } from "./common";
import type { Activity } from "./Activity";

export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export type CampaignSpatialLevel =
  | "city"
  | "center"
  | "governorate"
  | "region"
  | "custom";

export interface CampaignGoal {
  metric: string;
  target_value: number;
  current_value: number;
}

export interface Campaign extends BaseEntity {
  name: string;
  slug?: string | null;
  description?: string | null;
  status: CampaignStatus;
  starts_at: string;
  ends_at: string;
  owner_uuid: string;
  goals: CampaignGoal[];
  spatial_level?: CampaignSpatialLevel | null;
  bbox?: number[] | null;
  sent?: number;
  delivered?: number;
  created_at?: string;
  updated_at?: string;
  role?: string | null;
  membership_status?: string | null;
  permissions?: string[] | null;
  activities?: Activity[];
  budget?: number | null;
  tags?: string[];
}
