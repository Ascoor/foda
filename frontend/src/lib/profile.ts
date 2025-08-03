import { apiFetch } from './api';
import { getToken } from './auth';

export interface ProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

export async function fetchProfile() {
  const token = getToken();
  return apiFetch('/api/v1/profile', { token });
}

export async function updateProfile(payload: ProfilePayload) {
  const token = getToken();
  return apiFetch('/api/v1/profile', {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function uploadAvatar(file: File) {
  const token = getToken();
  const form = new FormData();
  form.append('avatar', file);
  return apiFetch('/api/v1/profile/avatar', {
    method: 'POST',
    token,
    body: form,
  });
}

export async function changePassword(payload: {
  password: string;
  password_confirmation: string;
}) {
  const token = getToken();
  return apiFetch('/api/v1/profile/password', {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
