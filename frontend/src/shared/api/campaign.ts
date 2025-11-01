import { api } from "./http";
import type { Committee, Id, KPIResponse } from "./types";

export async function fetchCampaignDashboard(campaignId: Id): Promise<KPIResponse> {
  const { data } = await api.get<KPIResponse>(`/api/v1/campaigns/${campaignId}/dashboard`);
  return data;
}

export async function fetchCampaignCommittees(
  campaignId: Id,
  page = 1,
): Promise<{ data: Committee[]; meta?: unknown }> {
  const { data } = await api.get(`/api/v1/campaigns/${campaignId}/committees`, {
    params: { page },
  });
  return data;
}

export async function attachCommittees(
  campaignId: Id,
  committeeIds: Id[],
  defaults?: { agent_quota?: number; target_voters?: number },
): Promise<void> {
  await api.post(`/api/v1/campaigns/${campaignId}/committees/attach`, {
    committee_ids: committeeIds,
    defaults: defaults ?? {},
  });
}

export async function detachCommittee(
  campaignId: Id,
  committeeId: Id,
): Promise<void> {
  await api.delete(`/api/v1/campaigns/${campaignId}/committees/${committeeId}`);
}
