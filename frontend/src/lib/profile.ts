import { apiFetch } from './api';
import { getToken } from './auth';

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export async function fetchProfile(): Promise<Profile> {
  const token = getToken();
  const data = await apiFetch('/api/v1/profiles', { token });
  return data.data[0] as Profile;
}

export async function updateProfile(
  id: number,
  payload: Partial<Profile>
): Promise<Profile> {
  const token = getToken();
  const data = await apiFetch(`/api/v1/profiles/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
  return data.data as Profile;
}
