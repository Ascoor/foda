import { apiFetch } from './api';
import { getToken } from './auth';

export interface Setting {
  key: string;
  value: string | number | boolean;
  type: 'string' | 'integer' | 'boolean';
  description?: string;
}

export async function fetchSettings(): Promise<Setting[]> {
  const token = getToken();
  const res = await apiFetch('/api/v1/settings', { token });
  return res.data ?? res;
}

export async function updateSettings(payload: Record<string, unknown>) {
  const token = getToken();
  return apiFetch('/api/v1/settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function fetchSettingByKey(key: string) {
  const token = getToken();
  return apiFetch(`/api/v1/settings/key/${key}`, { token });
}
