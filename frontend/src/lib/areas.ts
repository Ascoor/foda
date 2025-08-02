import { apiFetch } from './api';
import { getToken } from './auth';

export interface AreaPayload {
  name: string;
  description: string;
  x?: string;
  y?: string;
}

export async function fetchAreas() {
  const token = getToken();
  return apiFetch('/api/v1/areas', { token });
}

export async function createArea(payload: AreaPayload) {
  const token = getToken();
  return apiFetch('/api/v1/areas', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateArea(id: number, payload: AreaPayload) {
  const token = getToken();
  return apiFetch(`/api/v1/areas/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteArea(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/areas/${id}`, {
    method: 'DELETE',
    token,
  });
}
