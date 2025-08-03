export interface Agent {
  id: string;
  name: string;
  mobile: string;
  role: string;
  committee_id?: string | null;
  committee_name?: string;
}

export interface AgentFormData {
  name: string;
  mobile: string;
  role: string;
  committee_id?: string | null;
}

export interface AgentFilters {
  role?: string;
  committee_id?: string;
}
