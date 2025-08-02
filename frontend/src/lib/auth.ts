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

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}
