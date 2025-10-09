import { request } from '@/lib/api';
import type { ActivitiesResponse, ActivityFilters } from './types';

type ActivitiesEnvelope = ActivitiesResponse & { links?: unknown };

export const fetchActivities = async (filters: ActivityFilters = {}) => {
  const response = await request<ActivitiesEnvelope>({
    url: '/activities',
    method: 'get',
    params: filters,
  });

  return response;
};
