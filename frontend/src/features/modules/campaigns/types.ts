import type {
  Campaign as CampaignEntity,
  CampaignSpatialLevel,
  CampaignStatus,
} from "@/types";

export type Campaign = CampaignEntity;
export type { CampaignSpatialLevel };

export interface CampaignFormData {
  name: string;
  description?: string | null;
  status?: CampaignStatus;
  starts_at: string;
  ends_at: string;
  owner_uuid: string;
  goals: CampaignEntity["goals"];
  spatial_level: CampaignSpatialLevel;
  slug?: string | null;
  bbox?: number[] | null;
  budget?: number | null;
  tags?: string[];
}
