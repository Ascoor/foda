import { request } from "@shared/lib/api";
import { API_ENDPOINTS } from "@shared/lib/endpoints";
import { safeArray } from "@shared/lib/utils";
import type { Campaign, Election } from "@/types";
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
  payload: Partial<CampaignFormData> & Record<string, unknown>,
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

export const fetchCampaign = async (identifier: string | number) => {
  const { data } = await request<{ data: Campaign }>({
    url: `${CAMPAIGNS_ENDPOINT}/${identifier}`,
    method: "get",
  });

  return data;
};

export const fetchCampaignElections = async (
  campaignUuid: string,
): Promise<Election[]> => {
  const response = await request<{ data: Election[] }>({
    url: API_ENDPOINTS.elections.elections,
    method: "get",
    params: { campaign_uuid: campaignUuid },
    useCache: true,
  });

  return safeArray(response.data);
};

