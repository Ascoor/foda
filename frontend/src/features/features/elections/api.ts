import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { Election } from "@/types";
import type { ElectionFormData, ElectionFilters } from "./types";

type PaginatedResponse<T> = {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
  };
};

const ELECTIONS_ENDPOINT = API_ENDPOINTS.elections.elections;

export const fetchElections = async (params: ElectionFilters = {}) =>
  request<PaginatedResponse<Election>>(
    {
      url: ELECTIONS_ENDPOINT,
      method: "get",
      params,
    },
    { useCache: true },
  );

export const fetchElection = async (uuid: string) =>
  request<{ data: Election }>(
    { url: `${ELECTIONS_ENDPOINT}/${uuid}`, method: "get" },
    { useCache: true },
  );

export const createElection = async (payload: ElectionFormData) => {
  const data = await request<{ data: Election }>({
    url: ELECTIONS_ENDPOINT,
    method: "post",
    data: payload,
  });
  return data.data;
};

export const updateElection = async (
  uuid: string,
  payload: ElectionFormData,
) => {
  const data = await request<{ data: Election }>({
    url: `${ELECTIONS_ENDPOINT}/${uuid}`,
    method: "put",
    data: payload,
  });
  return data.data;
};

export const deleteElection = async (uuid: string) => {
  await request({ url: `${ELECTIONS_ENDPOINT}/${uuid}`, method: "delete" });
};
