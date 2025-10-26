import type { Committee as CommitteeEntity, CommitteeType } from "@/types";

export type Committee = CommitteeEntity;

export interface CommitteeFormData {
  name: string;
  type: CommitteeType;
  election_uuid: string;
  geo_area_uuid?: string | null;
  chair_uuid?: string | null;
  vice_chair_uuid?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  notes?: string | null;
}

export interface CommitteeFilters {
  search?: string;
  page?: number;
  per_page?: number;
  election_uuid?: string;
  geo_area_uuid?: string;
  type?: CommitteeType;
}
