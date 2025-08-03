export interface Voter {
  id: string;
  full_name: string;
  national_id: string;
  birth_date: string;
  gender: 'male' | 'female';
  address: string;
  area_id: string;
  committee_id: string | null;
  mobile: string;
  email?: string;
  registered_date: string;
  status: 'active' | 'inactive' | 'suspended';
  area_name?: string;
  committee_name?: string;
}

export interface VoterFormData {
  full_name: string;
  national_id: string;
  birth_date: string;
  gender: 'male' | 'female';
  address: string;
  area_id: string;
  committee_id: string | null;
  mobile: string;
  email?: string;
}

export interface VoterFilters {
  area_id?: string;
  committee_id?: string;
  gender?: 'male' | 'female';
  status?: 'active' | 'inactive' | 'suspended';
  age_range?: {
    min: number;
    max: number;
  };
}