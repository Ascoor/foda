import { request } from "@shared/lib/api";
import { API_ENDPOINTS } from "@shared/lib/endpoints";
import type { ActivitiesResponse, ActivityFilters } from "./types";

export const fetchActivities = async (filters: ActivityFilters = {}) =>
  request<ActivitiesResponse>({
    url: API_ENDPOINTS.campaigns.activities,
    method: "get",
    params: filters,
  });
