import type { Activity, ActivityStatus, ActivityType } from "@/types";

export interface ActivityMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export type ActivityListItem = Activity & {
  support_score?: number | null;
};

export interface ActivitiesResponse {
  data: ActivityListItem[];
  meta: ActivityMeta;
}

export interface ActivityFilters {
  campaign_uuid?: string;
  status?: ActivityStatus;
  type?: ActivityType;
  geo_area_uuid?: string;
  page?: number;
  per_page?: number;
}
