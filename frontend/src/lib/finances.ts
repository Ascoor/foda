import { apiFetch } from './api';
import { getToken } from './auth';

export interface FinancePayload {
  amount: number;
  type: string;
  date: string;
  description?: string;
  reference_id?: number;
  category_id: number;
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


export interface FinanceCategory {
  id: number;
  name: string;
}

export interface FinanceCategoryPayload {
  name: string;
}

export async function fetchCategories() {
  const token = getToken();
  return apiFetch('/api/v1/expense-categories', { token });
}

export async function createCategory(payload: FinanceCategoryPayload) {
  const token = getToken();
  return apiFetch('/api/v1/expense-categories', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(id: number, payload: FinanceCategoryPayload) {
  const token = getToken();
  return apiFetch(`/api/v1/expense-categories/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/expense-categories/${id}`, {
    method: 'DELETE',
    token,
  });
}

export async function fetchFinancialReport(params: { from?: string; to?: string } = {}) {
  const token = getToken();
  const query = new URLSearchParams();
  if (params.from) query.append('from', params.from);
  if (params.to) query.append('to', params.to);
  const q = query.toString();
  return apiFetch(`/api/v1/finances/report${q ? `?${q}` : ''}`, { token });
}
