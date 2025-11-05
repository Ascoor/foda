import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { CampaignIdentifier } from "@/infrastructure/shared/lib/campaign";
import type { Voter } from "@/types";
import type { VoterFilters, VoterFormData } from "./types";

type PaginatedResponse<T> = {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
  };
};

export const fetchVoters = async (
  params: VoterFilters & {
    page?: number;
    per_page?: number;
    search?: string;
  } = {},
  campaignId?: CampaignIdentifier | null,
) => {
  const endpoint = API_ENDPOINTS.crm.voters(campaignId);
  const response = await request<PaginatedResponse<Voter>>(
    {
      url: endpoint,
      method: "get",
      params,
    },
    { useCache: true },
  );

  return {
    data: response.data,
    total: response.meta?.total ?? response.data.length,
  };
};

export const fetchVoter = async (
  identifier: string | number,
  campaignId?: CampaignIdentifier | null,
) => {
  const endpoint = API_ENDPOINTS.crm.voters(campaignId);
  const response = await request<{ data: Voter }>(
    { url: `${endpoint}/${identifier}`, method: "get" },
    { useCache: true },
  );
  return response.data;
};

export const createVoter = async (
  payload: VoterFormData,
  campaignId?: CampaignIdentifier | null,
) => {
  const endpoint = API_ENDPOINTS.crm.voters(campaignId);
  const res = await request<{ data: Voter }>({
    url: endpoint,
    method: "post",
    data: payload,
  });
  return res.data;
};

export const updateVoter = async (
  identifier: string | number,
  payload: VoterFormData,
  campaignId?: CampaignIdentifier | null,
) => {
  const endpoint = API_ENDPOINTS.crm.voters(campaignId);
  const res = await request<{ data: Voter }>({
    url: `${endpoint}/${identifier}`,
    method: "put",
    data: payload,
  });
  return res.data;
};

export const deleteVoter = async (
  identifier: string | number,
  campaignId?: CampaignIdentifier | null,
) => {
  const endpoint = API_ENDPOINTS.crm.voters(campaignId);
  await request({ url: `${endpoint}/${identifier}`, method: "delete" });
};
