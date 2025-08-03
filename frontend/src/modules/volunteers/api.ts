import { Volunteer, VolunteerFormData, VolunteerFilters } from './types';

export const mockVolunteers: Volunteer[] = [
  { id: '1', name: 'Volunteer A', role: 'support', committee_id: '1', committee_name: 'Committee 001' },
  { id: '2', name: 'Volunteer B', role: 'logistics', committee_id: null }
];

export const mockCommittees = [
  { id: '1', name: 'Committee 001' },
  { id: '2', name: 'Committee 002' }
];

export const fetchVolunteers = async (filters?: VolunteerFilters): Promise<Volunteer[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  let data = [...mockVolunteers];
  if (filters?.role) data = data.filter(v => v.role === filters.role);
  if (filters?.committee_id) data = data.filter(v => v.committee_id === filters.committee_id);
  return data;
};

export const createVolunteer = async (data: VolunteerFormData): Promise<Volunteer> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const volunteer: Volunteer = { ...data, id: Math.random().toString(36).slice(2, 9) };
  mockVolunteers.push(volunteer);
  return volunteer;
};

export const updateVolunteer = async (id: string, data: Partial<VolunteerFormData>): Promise<Volunteer> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const volunteer = mockVolunteers.find(v => v.id === id);
  if (!volunteer) throw new Error('Volunteer not found');
  Object.assign(volunteer, data);
  return volunteer;
};

export const deleteVolunteer = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const assignVolunteer = async (id: string, committeeId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const volunteer = mockVolunteers.find(v => v.id === id);
  if (volunteer) {
    volunteer.committee_id = committeeId;
    const committee = mockCommittees.find(c => c.id === committeeId);
    volunteer.committee_name = committee?.name;
  }
};
