import { apiFetch } from './api';
import { getToken } from './auth';

export interface EventFilters {
  date?: string;
  area_id?: string | number;
  team_id?: string | number;
}

export async function fetchEvents(filters: EventFilters = {}) {
  const token = getToken();
  const params = new URLSearchParams();
  if (filters.date) params.append('date', filters.date);
  if (filters.area_id) params.append('area_id', String(filters.area_id));
  if (filters.team_id) params.append('team_id', String(filters.team_id));
  const query = params.toString();
  return apiFetch(`/api/v1/events${query ? `?${query}` : ''}`, { token });
}

export async function fetchUpcomingEvents() {
  const token = getToken();
  return apiFetch('/api/v1/events/upcoming', { token });
}

export async function fetchEvent(id: number | string) {
  const token = getToken();
  return apiFetch(`/api/v1/events/${id}`, { token });
}

export interface EventPayload {
  name: string;
  organiser: string;
  location: string;
  date: string;
  area_id: string | number;
  team_id: string | number;
  description?: string;
}

export async function createEvent(data: EventPayload) {
  const token = getToken();
  return apiFetch('/api/v1/events', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export async function updateEvent(id: number, data: EventPayload) {
  const token = getToken();
  return apiFetch(`/api/v1/events/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/events/${id}`, { method: 'DELETE', token });
}
