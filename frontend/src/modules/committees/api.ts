import api, { request } from '../../lib/api';
import { Committee, CommitteeFormData, CommitteeFilters, GeoArea } from './types';

export const fetchCommittees = async (params: CommitteeFilters = {}) => {
  return request<{ data: Committee[]; total: number }>({
    url: '/ec/committees',
    method: 'get',
    params,
  }, { useCache: true });
};

export const fetchCommittee = async (id: string) => {
  return request<Committee>({ url: `/ec/committees/${id}`, method: 'get' }, { useCache: true });
};

export const createCommittee = async (payload: CommitteeFormData) => {
  const data = await request<{ data: Committee }>({
    url: '/ec/committees',
    method: 'post',
    data: payload,
  });
  return data.data;
};

export const updateCommittee = async (id: string, payload: CommitteeFormData) => {
  const data = await request<{ data: Committee }>({
    url: `/ec/committees/${id}`,
    method: 'put',
    data: payload,
  });
  return data.data;
};

export const deleteCommittee = async (id: string) => {
  await request({ url: `/ec/committees/${id}`, method: 'delete' });
};

export const assignMembers = async (committeeId: string, memberIds: string[]) => {
  await request({
    url: `/ec/committees/${committeeId}/members`,
    method: 'post',
    data: { member_ids: memberIds },
  });
};

export const fetchGeoAreas = async () => {
  return request<{ data: GeoArea[] }>({ url: '/ec/geo-areas', method: 'get' }, { useCache: true });
};
export default api;
