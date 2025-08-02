import { apiFetch } from './api';
import { getToken } from './auth';

interface MemberPayload {
  name: string;
  email: string;
  role?: string;
}

export async function fetchMembers() {
  const token = getToken();
  return apiFetch('/api/v1/members', { token });
}

export async function createMember(payload: MemberPayload) {
  const token = getToken();
  return apiFetch('/api/v1/members', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}
