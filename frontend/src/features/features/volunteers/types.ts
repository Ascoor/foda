import type { Volunteer as VolunteerEntity, VolunteerStatus } from "@/types";

export type Volunteer = VolunteerEntity;
export type VolunteerListItem = VolunteerEntity;

export interface VolunteerFormData {
  full_name: string;
  email?: string | null;
  phone?: string | null;
  status?: VolunteerStatus;
  election_uuid?: string;
  assigned_committee_uuid?: string | null;
  skills?: string[];
  availability?: VolunteerEntity["availability"];
  notes?: string | null;
}

export interface VolunteerFilters {
  status?: VolunteerStatus;
  assigned_committee_uuid?: string;
  skills?: string[];
  search?: string;
}
