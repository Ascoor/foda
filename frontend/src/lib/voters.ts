import { apiFetch, API_BASE_URL } from './api';
import { getToken } from './auth';

export interface VoterPayload {
  name: string;
  email?: string;
  phone?: string;
  area_id: string | number;
  address?: string;
  sex?: string;
  birthdate?: string;
  voter_id: string;
}

export async function fetchVoters(params?: { name?: string; area_id?: string | number; voter_id?: string }) {
  const token = getToken();
  const query = new URLSearchParams();
  if (params?.name) query.append('name', params.name);
  if (params?.area_id) query.append('area_id', String(params.area_id));
  if (params?.voter_id) query.append('voter_id', params.voter_id);
  const url = query.toString() ? `/api/v1/voters?${query}` : '/api/v1/voters';
  return apiFetch(url, { token });
}

export async function createVoter(payload: VoterPayload) {
  const token = getToken();
  return apiFetch('/api/v1/voters', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateVoter(id: number, payload: VoterPayload) {
  const token = getToken();
  return apiFetch(`/api/v1/voters/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteVoter(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/voters/${id}`, { method: 'DELETE', token });
}

export async function importVoters(file: File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/v1/voters/import`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function exportVoters() {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/voters/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'voters.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
