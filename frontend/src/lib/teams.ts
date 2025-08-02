import { apiFetch } from './api';
import { getToken } from './auth';

export async function fetchTeams() {
  const token = getToken();
  return apiFetch('/api/v1/teams', { token });
}
