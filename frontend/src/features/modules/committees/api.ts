import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { Committee, GeoArea } from "@/types";
import type { CommitteeFilters, CommitteeFormData } from "./types";

type PaginatedResponse<T> = {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
  };
};

const COMMITTEES_ENDPOINT = API_ENDPOINTS.elections.committees;

export const fetchCommittees = async (params: CommitteeFilters = {}) => {
  const response = await request<PaginatedResponse<Committee>>(
    {
      url: COMMITTEES_ENDPOINT,
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

export const fetchCommittee = async (identifier: string | number) => {
  const response = await request<{ data: Committee }>(
    { url: `${COMMITTEES_ENDPOINT}/${identifier}`, method: "get" },
    { useCache: true },
  );
  return response.data;
};

export const createCommittee = async (payload: CommitteeFormData) => {
  const data = await request<{ data: Committee }>({
    url: COMMITTEES_ENDPOINT,
    method: "post",
    data: payload,
  });
  return data.data;
};

export const updateCommittee = async (
  identifier: string | number,
  payload: CommitteeFormData,
) => {
  const data = await request<{ data: Committee }>({
    url: `${COMMITTEES_ENDPOINT}/${identifier}`,
    method: "put",
    data: payload,
  });
  return data.data;
};

export const deleteCommittee = async (identifier: string | number) => {
  await request({
    url: `${COMMITTEES_ENDPOINT}/${identifier}`,
    method: "delete",
  });
};

export const assignMembers = async (
  committeeIdentifier: string | number,
  memberUuids: string[],
) => {
  await request({
    url: `${COMMITTEES_ENDPOINT}/${committeeIdentifier}/members`,
    method: "post",
    data: { member_uuids: memberUuids },
  });
};

export const fetchGeoAreas = async () => {
  const response = await request<{ data: GeoArea[] }>(
    { url: API_ENDPOINTS.elections.geoAreas, method: "get" },
    { useCache: true },
  );
  return response;
};
