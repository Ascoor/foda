import { Voter, VoterFormData, VoterFilters } from './types';

// Mock data
export const mockVoters: Voter[] = [
  {
    id: '1',
    full_name: 'Ahmed Hassan Mohamed',
    national_id: '29801152301234',
    birth_date: '1998-01-15',
    gender: 'male',
    address: '123 Tahrir Square, Cairo',
    area_id: '1',
    committee_id: '1',
    mobile: '+201234567890',
    email: 'ahmed.hassan@email.com',
    registered_date: '2024-01-10T10:00:00Z',
    status: 'active',
    area_name: 'Cairo',
    committee_name: 'Committee 001'
  },
  {
    id: '2',
    full_name: 'Fatima Ali Ibrahim',
    national_id: '29205201801567',
    birth_date: '1992-05-20',
    gender: 'female',
    address: '456 Alexandria Street, Alexandria',
    area_id: '4',
    committee_id: '2',
    mobile: '+201987654321',
    email: 'fatima.ali@email.com',
    registered_date: '2024-01-12T14:30:00Z',
    status: 'active',
    area_name: 'Alexandria',
    committee_name: 'Committee 002'
  },
  {
    id: '3',
    full_name: 'Omar Mahmoud Abdel Rahman',
    national_id: '28512101901890',
    birth_date: '1985-12-10',
    gender: 'male',
    address: '789 Nile Street, Giza',
    area_id: '1',
    committee_id: null,
    mobile: '+201555666777',
    registered_date: '2024-01-14T09:15:00Z',
    status: 'active',
    area_name: 'Cairo'
  },
  {
    id: '4',
    full_name: 'Nour Khaled Mansour',
    national_id: '30003251202345',
    birth_date: '2000-03-25',
    gender: 'female',
    address: '321 Modern City, New Cairo',
    area_id: '3',
    committee_id: '3',
    mobile: '+201444333222',
    email: 'nour.khaled@email.com',
    registered_date: '2024-01-16T16:45:00Z',
    status: 'inactive',
    area_name: 'New Cairo',
    committee_name: 'Committee 003'
  }
];

// Mock committees for assignment
export const mockCommittees = [
  { id: '1', name: 'Committee 001', area_id: '1', area_name: 'Cairo' },
  { id: '2', name: 'Committee 002', area_id: '4', area_name: 'Alexandria' },
  { id: '3', name: 'Committee 003', area_id: '3', area_name: 'New Cairo' },
  { id: '4', name: 'Committee 004', area_id: '2', area_name: 'Nasr City' }
];

export const fetchVoters = async (filters?: VoterFilters): Promise<Voter[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let filtered = [...mockVoters];
  
  if (filters?.area_id) {
    filtered = filtered.filter(voter => voter.area_id === filters.area_id);
  }
  
  if (filters?.committee_id) {
    filtered = filtered.filter(voter => voter.committee_id === filters.committee_id);
  }
  
  if (filters?.gender) {
    filtered = filtered.filter(voter => voter.gender === filters.gender);
  }
  
  if (filters?.status) {
    filtered = filtered.filter(voter => voter.status === filters.status);
  }
  
  return filtered;
};

export const createVoter = async (data: VoterFormData): Promise<Voter> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newVoter: Voter = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    registered_date: new Date().toISOString(),
    status: 'active'
  };
  
  return newVoter;
};

export const updateVoter = async (id: string, data: Partial<VoterFormData>): Promise<Voter> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existing = mockVoters.find(voter => voter.id === id);
  if (!existing) throw new Error('Voter not found');
  
  return {
    ...existing,
    ...data
  };
};

export const deleteVoter = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const bulkAssignCommittee = async (voterIds: string[], committeeId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const importVotersFromCSV = async (file: File): Promise<{ success: number; errors: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate import result
  return {
    success: 150,
    errors: [
      'Row 5: Invalid national ID format',
      'Row 12: Missing required field: mobile'
    ]
  };
};