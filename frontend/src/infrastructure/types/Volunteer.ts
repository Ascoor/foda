import type { BaseEntity, Nullable } from "./common";

export type VolunteerStatus = "active" | "onboarding" | "inactive";

export interface VolunteerAvailability {
  weekdays: string[];
  hours_per_week: number;
}

export interface Volunteer extends BaseEntity {
  full_name: string;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  status: VolunteerStatus;
  election_uuid?: string | null;
  assigned_committee_uuid?: Nullable<string>;
  // Legacy compatibility fields until UI fully migrated
  name?: string;
  role?: string;
  committee_name?: string;
  skills?: string[];
  availability?: VolunteerAvailability;
  notes?: string | null;
}
