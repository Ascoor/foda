import { apiFetch } from './api';
import { getToken } from './auth';

export interface VolunteerPayload {
  name: string;
  email?: string;
  phone?: string;
  team_id?: number | null;
}

export async function fetchVolunteers() {
  const token = getToken();
  return apiFetch('/api/v1/volunteers', { token });
}

export async function createVolunteer(payload: VolunteerPayload) {
  const token = getToken();
  return apiFetch('/api/v1/volunteers', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateVolunteer(id: number, payload: VolunteerPayload) {
  const token = getToken();
  return apiFetch(`/api/v1/volunteers/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteVolunteer(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/volunteers/${id}`, {
    method: 'DELETE',
    token,
  });
}
