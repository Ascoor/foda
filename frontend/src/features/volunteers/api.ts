import { request } from "@shared/lib/api";
import { API_ENDPOINTS } from "@shared/lib/endpoints";
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

const VOLUNTEERS_ENDPOINT = API_ENDPOINTS.crm.volunteers;

export const fetchVolunteers = async (
  filters: VolunteerFilters & { page?: number; per_page?: number } = {},
) =>
  request<PaginatedResponse<Volunteer>>(
    {
      url: VOLUNTEERS_ENDPOINT,
      method: "get",
      params: filters,
    },
    { useCache: true },
  );

export const createVolunteer = async (data: VolunteerFormData) => {
  const response = await request<{ data: Volunteer }>({
    url: VOLUNTEERS_ENDPOINT,
    method: "post",
    data,
  });
  return response.data;
};

export const updateVolunteer = async (
  uuid: string,
  data: Partial<VolunteerFormData>,
) => {
  const response = await request<{ data: Volunteer }>({
    url: `${VOLUNTEERS_ENDPOINT}/${uuid}`,
    method: "put",
    data,
  });
  return response.data;
};

export const deleteVolunteer = async (uuid: string) => {
  await request({ url: `${VOLUNTEERS_ENDPOINT}/${uuid}`, method: "delete" });
};

export const assignVolunteer = async (
  uuid: string,
  committee_uuid: string,
): Promise<void> => {
  await request({
    url: `${VOLUNTEERS_ENDPOINT}/${uuid}/assign`,
    method: "post",
    data: { committee_uuid },
  });
};
