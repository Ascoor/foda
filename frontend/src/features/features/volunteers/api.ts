import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { CampaignIdentifier } from "@/infrastructure/shared/lib/campaign";
import type { Volunteer } from "@/types";
import type { VolunteerFilters, VolunteerFormData } from "./types";

type PaginatedResponse<T> = {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
  };
};

export const fetchVolunteers = async (
  filters: VolunteerFilters & { page?: number; per_page?: number } = {},
  campaignId?: CampaignIdentifier | null,
) =>
  request<PaginatedResponse<Volunteer>>(
    {
      url: API_ENDPOINTS.crm.volunteers(campaignId),
      method: "get",
      params: filters,
    },
    { useCache: true },
  );

export const createVolunteer = async (
  data: VolunteerFormData,
  campaignId?: CampaignIdentifier | null,
) => {
  const response = await request<{ data: Volunteer }>({
    url: API_ENDPOINTS.crm.volunteers(campaignId),
    method: "post",
    data,
  });
  return response.data;
};

export const updateVolunteer = async (
  uuid: string,
  data: Partial<VolunteerFormData>,
  campaignId?: CampaignIdentifier | null,
) => {
  const response = await request<{ data: Volunteer }>({
    url: `${API_ENDPOINTS.crm.volunteers(campaignId)}/${uuid}`,
    method: "put",
    data,
  });
  return response.data;
};

export const deleteVolunteer = async (
  uuid: string,
  campaignId?: CampaignIdentifier | null,
) => {
  await request({
    url: `${API_ENDPOINTS.crm.volunteers(campaignId)}/${uuid}`,
    method: "delete",
  });
};

export const assignVolunteer = async (
  uuid: string,
  committee_uuid: string,
  campaignId?: CampaignIdentifier | null,
): Promise<void> => {
  await request({
    url: `${API_ENDPOINTS.crm.volunteers(campaignId)}/${uuid}/assign`,
    method: "post",
    data: { committee_uuid },
  });
};
