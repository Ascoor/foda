import { request } from '../../lib/api';
import { Observation, ObservationFormData, ObservationFilters } from './types';

// TODO: remove mock committees once backend endpoint is wired for the form
export const mockCommittees = [
  { id: '1', name: 'Committee 001' },
  { id: '2', name: 'Committee 002' },
];

export const fetchObservations = async (
  params: ObservationFilters = {}
): Promise<Observation[]> => {
  const { data } = await request<{ data: Observation[] }>({
    url: '/ec/observations',
    method: 'get',
    params,
  });
  return data;
};

export const createObservation = async (
  payload: ObservationFormData
): Promise<Observation> => {
  const { data } = await request<{ data: Observation }>({
    url: '/ec/observations',
    method: 'post',
    data: payload,
  });
  return data;
};

export const updateObservation = async (
  id: string,
  payload: Partial<ObservationFormData>
): Promise<Observation> => {
  const { data } = await request<{ data: Observation }>({
    url: `/ec/observations/${id}`,
    method: 'put',
    data: payload,
  });
  return data;
};

export const deleteObservation = async (id: string): Promise<void> => {
  await request({ url: `/ec/observations/${id}`, method: 'delete' });
};
