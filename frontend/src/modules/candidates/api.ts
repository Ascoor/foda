import { Candidate, CandidateFormData, CandidateFilters } from './types';

const mockCandidates: Candidate[] = [
  { id: '1', name: 'John Doe', party: 'Party A', type: 'individual', status: 'active' },
  { id: '2', name: 'List X', party: 'Party B', type: 'list', status: 'withdrawn' }
];

export const fetchCandidates = async (filters?: CandidateFilters): Promise<Candidate[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  let data = [...mockCandidates];
  if (filters?.type) data = data.filter(c => c.type === filters.type);
  if (filters?.status) data = data.filter(c => c.status === filters.status);
  if (filters?.party) data = data.filter(c => c.party === filters.party);
  return data;
};

export const createCandidate = async (data: CandidateFormData): Promise<Candidate> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const candidate: Candidate = { ...data, id: Math.random().toString(36).slice(2, 9) };
  mockCandidates.push(candidate);
  return candidate;
};

export const updateCandidate = async (id: string, data: Partial<CandidateFormData>): Promise<Candidate> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const candidate = mockCandidates.find(c => c.id === id);
  if (!candidate) throw new Error('Candidate not found');
  Object.assign(candidate, data);
  return candidate;
};

export const deleteCandidate = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const exportCandidates = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const importCandidates = async (_file: File): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};
