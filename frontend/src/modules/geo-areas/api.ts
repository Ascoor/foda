import { request } from '../../lib/api';
import { GeoArea, GeoAreaFormData } from './types';

export const fetchGeoAreas = async (): Promise<GeoArea[]> => {
  const res = await request<{ data: GeoArea[] }>({
    url: '/ec/geo-areas',
    method: 'get',
  }, { useCache: true });
  return res.data;
};

export const fetchGeoArea = async (id: string): Promise<GeoArea> => {
  return request<GeoArea>({
    url: `/ec/geo-areas/${id}`,
    method: 'get',
  }, { useCache: true });
};

export const createGeoArea = async (payload: GeoAreaFormData) => {
  const res = await request<{ data: GeoArea }>({
    url: '/ec/geo-areas',
    method: 'post',
    data: payload,
  });
  return res.data;
};

export const updateGeoArea = async (id: string, payload: GeoAreaFormData) => {
  const res = await request<{ data: GeoArea }>({
    url: `/ec/geo-areas/${id}`,
    method: 'put',
    data: payload,
  });
  return res.data;
};

export const deleteGeoArea = async (id: string) => {
  await request({ url: `/ec/geo-areas/${id}`, method: 'delete' });
};
