export interface Volunteer {
  id: string;
  name: string;
  role: string;
  committee_id?: string | null;
  committee_name?: string;
}

export interface VolunteerFormData {
  name: string;
  role: string;
  committee_id?: string | null;
}

export interface VolunteerFilters {
  role?: string;
  committee_id?: string;
}
