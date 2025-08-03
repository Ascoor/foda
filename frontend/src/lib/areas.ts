import { apiFetch } from './api';
import { getToken } from './auth';

// Legacy table fields: old/application/modules/area/views/area.php
// Backend fields: id, name, description, x, y
export interface Area {
  id: number;
  name: string;
  description: string;
  x?: string;
  y?: string;
}

export interface AreaPayload {
  name: string;
  description: string;
  x?: string;
  y?: string;
}

export async function fetchAreas(params?: Record<string, string>) {
  const token = getToken();
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return apiFetch(`/api/v1/areas${query}`, { token });
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
