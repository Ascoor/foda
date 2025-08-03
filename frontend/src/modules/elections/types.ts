export interface Election {
  id: string;
  name: string;
  type: 'presidential' | 'parliamentary' | 'local' | 'referendum';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  description?: string;
}

export interface ElectionFormData {
  name: string;
  type: Election['type'];
  start_date: string;
  end_date: string;
  description?: string;
}

export interface ElectionFilters {
  search?: string;
  page?: number;
  per_page?: number;
  status?: Election['status'];
  type?: Election['type'];
}
