export interface Candidate {
  id: string;
  name: string;
  party: string;
  type: 'individual' | 'list';
  status: 'active' | 'withdrawn';
}

export interface CandidateFormData {
  name: string;
  party: string;
  type: 'individual' | 'list';
  status: 'active' | 'withdrawn';
}

export interface CandidateFilters {
  type?: 'individual' | 'list';
  status?: 'active' | 'withdrawn';
  party?: string;
}
