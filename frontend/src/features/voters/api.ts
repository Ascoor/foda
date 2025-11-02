import { request } from "@/shared/lib/api";
import { API_ENDPOINTS } from "@/shared/lib/endpoints";
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

const VOTERS_ENDPOINT = API_ENDPOINTS.crm.voters;

export const fetchVoters = async (
  params: VoterFilters & {
    page?: number;
    per_page?: number;
    search?: string;
  } = {},
) => {
  const response = await request<PaginatedResponse<Voter>>(
    {
      url: VOTERS_ENDPOINT,
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

export const fetchVoter = async (identifier: string | number) => {
  const response = await request<{ data: Voter }>(
    { url: `${VOTERS_ENDPOINT}/${identifier}`, method: "get" },
    { useCache: true },
  );
  return response.data;
};

export const createVoter = async (payload: VoterFormData) => {
  const res = await request<{ data: Voter }>({
    url: VOTERS_ENDPOINT,
    method: "post",
    data: payload,
  });
  return res.data;
};

export const updateVoter = async (
  identifier: string | number,
  payload: VoterFormData,
) => {
  const res = await request<{ data: Voter }>({
    url: `${VOTERS_ENDPOINT}/${identifier}`,
    method: "put",
    data: payload,
  });
  return res.data;
};

export const deleteVoter = async (identifier: string | number) => {
  await request({ url: `${VOTERS_ENDPOINT}/${identifier}`, method: "delete" });
};
