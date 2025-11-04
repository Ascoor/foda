import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { Campaign } from "@/types";
import type { CampaignFormData } from "./types";

const CAMPAIGNS_ENDPOINT = API_ENDPOINTS.campaigns.campaigns;

export const fetchCampaigns = async (params: Record<string, unknown> = {}) => {
  const { data } = await request<{ data: Campaign[] }>({
    url: CAMPAIGNS_ENDPOINT,
    method: "get",
    params,
  });
  return data;
};

export const createCampaign = async (
  payload: CampaignFormData,
): Promise<Campaign> => {
  const { data } = await request<{ data: Campaign }>({
    url: CAMPAIGNS_ENDPOINT,
    method: "post",
    data: payload,
  });
  return data;
};

export const updateCampaign = async (
  identifier: string | number,
  payload: Partial<CampaignFormData>,
): Promise<Campaign> => {
  const { data } = await request<{ data: Campaign }>({
    url: `${CAMPAIGNS_ENDPOINT}/${identifier}`,
    method: "put",
    data: payload,
  });
  return data;
};

export const deleteCampaign = async (
  identifier: string | number,
): Promise<void> => {
  await request({
    url: `${CAMPAIGNS_ENDPOINT}/${identifier}`,
    method: "delete",
  });
};

export const sendCampaign = async (
  identifier: string | number,
): Promise<void> => {
  await request({
    url: `${CAMPAIGNS_ENDPOINT}/${identifier}/send`,
    method: "post",
  });
};
