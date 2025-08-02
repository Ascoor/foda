import { apiFetch } from './api';
import { getToken } from './auth';

export interface SmsPayload {
  message: string;
  recipient: string;
  scheduled_for?: string;
}

export async function fetchSms() {
  const token = getToken();
  return apiFetch('/api/v1/sms', { token });
}

export async function sendSms(payload: SmsPayload) {
  const token = getToken();
  return apiFetch('/api/v1/sms', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteSms(id: number) {
  const token = getToken();
  return apiFetch(`/api/v1/sms/${id}`, {
    method: 'DELETE',
    token,
  });
}
