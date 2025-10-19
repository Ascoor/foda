export type CandidateType = "individual" | "list";
export type CandidateStatus = "active" | "withdrawn" | "disqualified";

export interface Candidate {
  id: number;
  uuid: string;
  full_name: string;
  party?: string | null;
  type: CandidateType;
  status: CandidateStatus;
  campaign_uuid?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateFormData {
  full_name: string;
  party?: string | null;
  type: CandidateType;
  status?: CandidateStatus;
  campaign_uuid?: string | null;
}

export interface CandidateFilters {
  type?: CandidateType;
  status?: CandidateStatus;
  party?: string;
  campaign_uuid?: string;
}
