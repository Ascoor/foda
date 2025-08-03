import { Observation, ObservationFormData, ObservationFilters } from './types';

export const mockObservations: Observation[] = [
  {
    id: '1',
    observer: 'Observer A',
    committee_id: '1',
    committee_name: 'Committee 001',
    type: 'violation',
    description: 'Sample violation',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    observer: 'Observer B',
    committee_id: '2',
    committee_name: 'Committee 002',
    type: 'note',
    description: 'Sample note',
    timestamp: new Date().toISOString(),
  },
];

export const mockCommittees = [
  { id: '1', name: 'Committee 001' },
  { id: '2', name: 'Committee 002' },
];

export const fetchObservations = async (filters?: ObservationFilters): Promise<Observation[]> => {
  await new Promise((r) => setTimeout(r, 500));
  let data = [...mockObservations];
  if (filters?.type) data = data.filter((o) => o.type === filters.type);
  if (filters?.committee_id) data = data.filter((o) => o.committee_id === filters.committee_id);
  return data;
};

export const createObservation = async (data: ObservationFormData): Promise<Observation> => {
  await new Promise((r) => setTimeout(r, 500));
  const obs: Observation = {
    id: Math.random().toString(36).slice(2, 9),
    observer: data.observer,
    committee_id: data.committee_id,
    committee_name: data.committee_id ? `Committee ${data.committee_id}` : undefined,
    type: data.type,
    description: data.description,
    timestamp: new Date().toISOString(),
    image_url: data.image ? URL.createObjectURL(data.image) : undefined,
  };
  mockObservations.push(obs);
  return obs;
};

export const updateObservation = async (
  id: string,
  data: Partial<ObservationFormData>
): Promise<Observation> => {
  await new Promise((r) => setTimeout(r, 500));
  const obs = mockObservations.find((o) => o.id === id);
  if (!obs) throw new Error('Observation not found');
  Object.assign(obs, data);
  if (data.image) obs.image_url = URL.createObjectURL(data.image);
  return obs;
};

export const deleteObservation = async (id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 500));
};
