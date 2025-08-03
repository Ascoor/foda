import { request } from '../../lib/api';
import { Voter, VoterFormData, VoterFilters } from './types';

export const fetchVoters = async (params: VoterFilters & { page?: number; per_page?: number; search?: string } = {}) => {
  return request<{ data: Voter[]; total: number }>({
    url: '/ec/voters',
    method: 'get',
    params,
  }, { useCache: true });
};

export const fetchVoter = async (id: string) => {
  return request<Voter>({ url: `/ec/voters/${id}`, method: 'get' }, { useCache: true });
};

export const createVoter = async (payload: VoterFormData) => {
  const res = await request<{ data: Voter }>({
    url: '/ec/voters',
    method: 'post',
    data: payload,
  });
  return res.data;
};

export const updateVoter = async (id: string, payload: VoterFormData) => {
  const res = await request<{ data: Voter }>({
    url: `/ec/voters/${id}`,
    method: 'put',
    data: payload,
  });
  return res.data;
};

export const deleteVoter = async (id: string) => {
  await request({ url: `/ec/voters/${id}`, method: 'delete' });
};
