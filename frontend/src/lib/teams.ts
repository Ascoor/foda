import { apiFetch } from './api';
import { getToken } from './auth';

export interface TeamPayload {
  name: string;
  area_id: number | string;
  supervisor_id: number | string;
}

export async function fetchTeams() {
  const token = getToken();
  return apiFetch('/api/v1/teams', { token });
}

export async function createTeam(payload: TeamPayload) {
  const token = getToken();
  return apiFetch('/api/v1/teams', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateTeam(id: number, payload: Partial<TeamPayload>) {
  const token = getToken();
  return apiFetch(`/api/v1/teams/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteTeam(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/teams/${id}`, { method: 'DELETE', token });
}

export async function assignVolunteers(teamId: number, volunteerIds: number[]) {
  const token = getToken();
  return apiFetch(`/api/v1/teams/${teamId}/volunteers`, {
    method: 'POST',
    token,
    body: JSON.stringify({ volunteer_ids: volunteerIds }),
  });
}

export async function removeVolunteer(teamId: number, volunteerId: number) {
  const token = getToken();
  return apiFetch(`/api/v1/teams/${teamId}/volunteers/${volunteerId}`, {
    method: 'DELETE',
    token,
  });
}
