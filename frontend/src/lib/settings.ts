import { apiFetch } from './api';
import { getToken } from './auth';

export interface SettingPayload {
  key: string;
  value: string;
  type: 'string' | 'integer' | 'boolean';
  description?: string;
}

export async function fetchSettings() {
  const token = getToken();
  return apiFetch('/api/v1/settings', { token });
}

export async function fetchSettingByKey(key: string) {
  const token = getToken();
  return apiFetch(`/api/v1/settings/key/${key}`, { token });
}

export async function createSetting(payload: SettingPayload) {
  const token = getToken();
  return apiFetch('/api/v1/settings', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateSetting(id: number, payload: Partial<SettingPayload>) {
  const token = getToken();
  return apiFetch(`/api/v1/settings/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteSetting(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/settings/${id}`, {
    method: 'DELETE',
    token,
  });
}
