export interface Committee {
  id: string;
  name: string;
  location: string;
  geo_area_id: string;
  geo_area_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommitteeFormData {
  name: string;
  location: string;
  geo_area_id: string;
}

export interface CommitteeFilters {
  search?: string;
  page?: number;
  per_page?: number;
  geo_area_id?: string;
}

export interface GeoArea {
  id: string;
  name: string;
}
