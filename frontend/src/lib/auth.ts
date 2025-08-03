import { apiFetch } from './api';

const TOKEN_KEY = 'token';

export async function login(email: string, password: string) {
  const data = await apiFetch('/api/v1/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const token = data.data.token;
  localStorage.setItem(TOKEN_KEY, token);
  return data;
}

export async function logout() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    await apiFetch('/api/v1/logout', { method: 'POST', token });
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  roleId: number
) {
  const token = getToken();
  const data = await apiFetch('/api/v1/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role_id: roleId }),
    token: token || undefined,
  });
  const newToken = data.data.token;
  localStorage.setItem(TOKEN_KEY, newToken);
  return data;
}

export async function getProfile() {
  const token = getToken();
  return apiFetch('/api/v1/profile', { token: token || undefined });
}

export async function updateProfile(payload: {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}) {
  const token = getToken();
  return apiFetch('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
    token: token || undefined,
  });
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export async function requestPasswordReset(email: string) {
  return apiFetch('/api/v1/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  email: string,
  password: string,
  password_confirmation: string
) {
  return apiFetch('/api/v1/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, email, password, password_confirmation }),
  });
}
