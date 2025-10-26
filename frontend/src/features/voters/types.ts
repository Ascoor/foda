import type { Voter, VoterStatus } from "@/types";

export type VoterListItem = Voter;

export interface VoterFormData {
  full_name: string;
  national_id: string;
  gender: Voter["gender"];
  birth_date: string;
  election_uuid: string;
  geo_area_uuid?: string | null;
  committee_uuid?: string | null;
  status?: VoterStatus;
  contact: Partial<Voter["contact"]>;
  tags?: string[];
}

export interface VoterFilters {
  status?: VoterStatus;
  geo_area_uuid?: string;
  committee_uuid?: string;
  gender?: Voter["gender"];
  search?: string;
  tags?: string[];
}
