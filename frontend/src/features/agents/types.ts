import type { Agent } from "@/types";

export type AgentListItem = Agent;

export interface AgentFormData {
  full_name: string;
  code: string;
  status: Agent["status"];
  contact_number?: string | null;
  email?: string | null;
  assignment: Partial<Agent["assignment"]>;
  notes?: string | null;
}

export interface AgentFilters {
  status?: Agent["status"];
  geo_area_uuid?: string;
  committee_uuid?: string;
  search?: string;
}
