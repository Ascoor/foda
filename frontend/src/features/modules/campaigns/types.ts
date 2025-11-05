import type { Campaign as CampaignEntity, CampaignStatus } from "@/types";

export type Campaign = CampaignEntity;

export interface CampaignFormData {
  name: string;
  description?: string | null;
  status?: CampaignStatus;
  starts_at: string;
  ends_at: string;
  owner_uuid: string;
  goals: CampaignEntity["goals"];
  budget?: number | null;
  tags?: string[];
}
