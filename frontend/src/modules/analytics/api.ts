import { request } from '@/lib/api';
import { AnalyticsFilters, AnalyticsResponse } from './types';

type AnalyticsEnvelope = {
  data: AnalyticsResponse;
};

export const fetchAnalytics = async (
  filters: AnalyticsFilters = {},
): Promise<AnalyticsResponse> => {
  const response = await request<AnalyticsEnvelope>(
    {
      url: '/analytics',
      method: 'get',
      params: filters,
    },
    { useCache: true },
  );

  return response.data;
};
