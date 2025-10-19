import type { BaseEntity, Nullable } from "./common";
import type { Activity } from "./Activity";

export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export interface CampaignGoal {
  metric: string;
  target_value: number;
  current_value: number;
}

export interface Campaign extends BaseEntity {
  name: string;
  description?: string | null;
  status: CampaignStatus;
  starts_at: string;
  ends_at: string;
  owner_uuid: string;
  goals: CampaignGoal[];
  sent?: number;
  delivered?: number;
  created_at?: string;
  activities?: Activity[];
  budget?: number | null;
  tags?: string[];
}
