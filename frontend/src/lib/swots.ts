import { apiFetch } from './api';
import { getToken } from './auth';

export interface SwotPayload {
  entity_type: string;
  entity_id: number;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export async function fetchSwots() {
  const token = getToken();
  return apiFetch('/api/v1/swots', { token });
}

export async function createSwot(payload: SwotPayload) {
  const token = getToken();
  return apiFetch('/api/v1/swots', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateSwot(id: number, payload: SwotPayload) {
  const token = getToken();
  return apiFetch(`/api/v1/swots/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteSwot(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/swots/${id}`, {
    method: 'DELETE',
    token,
  });
}

 
export async function fetchSwotReport(entityType: string, entityIds: number[] = []) {
  const token = getToken();
  const params = new URLSearchParams({ entity_type: entityType });
  entityIds.forEach(id => params.append('entity_ids[]', id.toString()));
  return apiFetch(`/api/v1/swots/report?${params.toString()}`, { token });
}
 