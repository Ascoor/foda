import type { BaseEntity, Nullable } from "./common";

export type AgentAssignmentType = "polling_station" | "field" | "digital";

export interface AgentAssignment {
  type: AgentAssignmentType;
  geo_area_uuid?: Nullable<string>;
  committee_uuid?: Nullable<string>;
  scheduled_at?: Nullable<string>;
}

export interface Agent extends BaseEntity {
  full_name: string;
  code: string;
  status: "active" | "standby" | "inactive";
  contact_number?: string | null;
  email?: string | null;
  assignment: AgentAssignment;
  notes?: string | null;
  // Legacy compatibility fields until UI fully migrated
  name?: string;
  mobile?: string;
  role?: string;
  committee_id?: string | null;
  committee_name?: string;
}
