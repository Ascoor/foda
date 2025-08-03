export interface GeoArea {
  id: string;
  name: string;
  parent_id: string | null;
  type: 'governorate' | 'district' | 'city' | 'village';
  total_voters: number;
  total_committees: number;
  created_at: string;
  updated_at: string;
  parent_name?: string;
  children_count?: number;
}

export interface GeoAreaFormData {
  name: string;
  parent_id: string | null;
  type: 'governorate' | 'district' | 'city' | 'village';
}