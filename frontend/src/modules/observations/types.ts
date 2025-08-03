export interface Observation {
  id: string;
  observer: string;
  committee_id: string | null;
  committee_name?: string;
  type: 'violation' | 'note' | 'complaint';
  description: string;
  image_url?: string;
  timestamp: string;
}

export interface ObservationFormData {
  observer: string;
  committee_id: string | null;
  type: 'violation' | 'note' | 'complaint';
  description: string;
  image?: File | null;
}

export interface ObservationFilters {
  type?: string;
  committee_id?: string;
}
