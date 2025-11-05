export type ObservationType = "violation" | "note" | "complaint";

export interface Observation {
  id: number;
  uuid: string;
  observer_name: string;
  observer?: string;
  committee_uuid: string | null;
  committee_name?: string;
  type: ObservationType;
  description: string;
  media_url?: string | null;
  captured_at: string;
  created_at: string;
  updated_at: string;
  timestamp?: string;
}

export interface ObservationFormData {
  observer_name: string;
  observer?: string;
  committee_uuid: string | null;
  type: ObservationType;
  description: string;
  attachment?: File | null;
}

export interface ObservationFilters {
  type?: ObservationType;
  committee_uuid?: string;
  from?: string;
  to?: string;
}
