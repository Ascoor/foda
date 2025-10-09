import type { FeatureCollection } from 'geojson';
import { request } from '@/lib/api';

export const fetchCommitteeGeo = async () => {
  return request<FeatureCollection>(
    { url: '/committees/geo', method: 'get' },
    { useCache: true }
  );
};

export const fetchRecentActivityGeo = async (params?: { limit?: number }) => {
  return request<FeatureCollection>(
    { url: '/activities/recent', method: 'get', params }
  );
};
