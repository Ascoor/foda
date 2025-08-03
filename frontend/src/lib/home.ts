import { apiFetch } from './api';
import { getToken } from './auth';

export interface HomeFilters {
  from?: string;
  to?: string;
}

export async function fetchHome(filters: HomeFilters = {}) {
  const token = getToken();
  const params = new URLSearchParams();
  if (filters.from) params.append('from', filters.from);
  if (filters.to) params.append('to', filters.to);
  const query = params.toString();
  return apiFetch(`/api/v1/home${query ? `?${query}` : ''}`, { token });
}

export async function fetchHeatmap() {
  const token = getToken();
  return apiFetch('/api/v1/home/heatmap', { token });
}
