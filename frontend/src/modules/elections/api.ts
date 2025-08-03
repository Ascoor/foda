import api, { request } from '../../lib/api';
import { Election, ElectionFormData, ElectionFilters } from './types';

export const fetchElections = async (params: ElectionFilters = {}) => {
  return request<{ data: Election[]; total: number }>({
    url: '/ec/elections',
    method: 'get',
    params,
  }, { useCache: true });
};

export const fetchElection = async (id: string) => {
  return request<Election>({ url: `/ec/elections/${id}`, method: 'get' }, { useCache: true });
};

export const createElection = async (payload: ElectionFormData) => {
  const data = await request<{ data: Election }>({
    url: '/ec/elections',
    method: 'post',
    data: payload,
  });
  return data.data;
};

export const updateElection = async (id: string, payload: ElectionFormData) => {
  const data = await request<{ data: Election }>({
    url: `/ec/elections/${id}`,
    method: 'put',
    data: payload,
  });
  return data.data;
};

export const deleteElection = async (id: string) => {
  await request({ url: `/ec/elections/${id}`, method: 'delete' });
};

export default api;
