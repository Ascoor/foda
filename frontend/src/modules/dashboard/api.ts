import type { FeatureCollection } from 'geojson';
import { request } from '@/lib/api';

export const fetchCommitteeGeo = async () =>
  request<FeatureCollection>({ url: '/committees/geo', method: 'get' }, { useCache: true });

export const fetchRecentActivityGeo = async (params?: { limit?: number }) =>
  request<FeatureCollection>({ url: '/activities/recent', method: 'get', params });
