import { request } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/endpoints';
import type { ActivitiesResponse, ActivityFilters } from './types';

export const fetchActivities = async (filters: ActivityFilters = {}) =>
  request<ActivitiesResponse>({
    url: API_ENDPOINTS.campaigns.activities,
    method: 'get',
    params: filters,
  });
