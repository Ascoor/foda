import { apiFetch } from './api';
import { getToken } from './auth';

export async function fetchAreas() {
  const token = getToken();
  return apiFetch('/api/v1/areas', { token });
}
