import axios from 'axios';
import { Committee, CommitteeFormData, CommitteeFilters, GeoArea } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const fetchCommittees = async (params: CommitteeFilters = {}) => {
  const { data } = await api.get<{ data: Committee[]; total: number }>('/ec/committees', { params });
  return data;
};

export const fetchCommittee = async (id: string) => {
  const { data } = await api.get<Committee>(`/ec/committees/${id}`);
  return data;
};

export const createCommittee = async (payload: CommitteeFormData) => {
  const { data } = await api.post<{ data: Committee }>('/ec/committees', payload);
  return data.data;
};

export const updateCommittee = async (id: string, payload: CommitteeFormData) => {
  const { data } = await api.put<{ data: Committee }>(`/ec/committees/${id}`, payload);
  return data.data;
};

export const deleteCommittee = async (id: string) => {
  await api.delete(`/ec/committees/${id}`);
};

export const assignMembers = async (committeeId: string, memberIds: string[]) => {
  await api.post(`/ec/committees/${committeeId}/members`, { member_ids: memberIds });
};

export const fetchGeoAreas = async () => {
  const { data } = await api.get<{ data: GeoArea[] }>('/ec/geo-areas');
  return data;
};

export default api;
