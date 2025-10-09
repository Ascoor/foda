export interface ActivityMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ActivityArea {
  id?: number;
  name?: string;
}

export interface ActivityTimelineItem {
  id: number;
  type: string;
  status: string | null;
  title: string;
  description: string | null;
  support_score: number | null;
  reported_at: string | null;
  created_at: string;
  area?: ActivityArea | null;
}

export interface ActivitiesResponse {
  data: ActivityTimelineItem[];
  meta: ActivityMeta;
}

export interface ActivityFilters {
  area_id?: number;
  status?: string;
  type?: string;
  page?: number;
}
