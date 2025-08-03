import { request } from '../../lib/api';
import { Candidate, CandidateFormData, CandidateFilters } from './types';

export const fetchCandidates = async (params: CandidateFilters & { page?: number; per_page?: number; search?: string } = {}) => {
  return request<{ data: Candidate[]; total: number }>({
    url: '/ec/candidates',
    method: 'get',
    params,
  }, { useCache: true });
};

export const fetchCandidate = async (id: string) => {
  return request<Candidate>({ url: `/ec/candidates/${id}`, method: 'get' }, { useCache: true });
};

export const createCandidate = async (payload: CandidateFormData) => {
  const res = await request<{ data: Candidate }>({
    url: '/ec/candidates',
    method: 'post',
    data: payload,
  });
  return res.data;
};

export const updateCandidate = async (id: string, payload: CandidateFormData) => {
  const res = await request<{ data: Candidate }>({
    url: `/ec/candidates/${id}`,
    method: 'put',
    data: payload,
  });
  return res.data;
};

export const deleteCandidate = async (id: string) => {
  await request({ url: `/ec/candidates/${id}`, method: 'delete' });
};
