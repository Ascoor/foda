import { apiFetch } from './api';
import { getToken } from './auth';

export interface FinancePayload {
  amount: number;
  type: string;
  date: string;
  description?: string;
  reference_id?: number;
}

export async function fetchFinances() {
  const token = getToken();
  return apiFetch('/api/v1/finances', { token });
}

export async function createFinance(payload: FinancePayload) {
  const token = getToken();
  return apiFetch('/api/v1/finances', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateFinance(id: number, payload: FinancePayload) {
  const token = getToken();
  return apiFetch(`/api/v1/finances/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteFinance(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/finances/${id}`, {
    method: 'DELETE',
    token,
  });
}

