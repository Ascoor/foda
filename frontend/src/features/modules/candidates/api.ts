import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { Candidate, CandidateFormData, CandidateFilters } from "./types";

type PaginatedResponse<T> = {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
  };
};

const CANDIDATES_ENDPOINT = API_ENDPOINTS.elections.candidates;

export const fetchCandidates = async (
  params: CandidateFilters & {
    page?: number;
    per_page?: number;
    search?: string;
  } = {},
) =>
  request<PaginatedResponse<Candidate>>(
    {
      url: CANDIDATES_ENDPOINT,
      method: "get",
      params,
    },
    { useCache: true },
  );

export const fetchCandidate = async (uuid: string) =>
  request<{ data: Candidate }>(
    { url: `${CANDIDATES_ENDPOINT}/${uuid}`, method: "get" },
    { useCache: true },
  );

export const createCandidate = async (payload: CandidateFormData) => {
  const res = await request<{ data: Candidate }>({
    url: CANDIDATES_ENDPOINT,
    method: "post",
    data: payload,
  });
  return res.data;
};

export const updateCandidate = async (
  uuid: string,
  payload: CandidateFormData,
) => {
  const res = await request<{ data: Candidate }>({
    url: `${CANDIDATES_ENDPOINT}/${uuid}`,
    method: "put",
    data: payload,
  });
  return res.data;
};

export const deleteCandidate = async (uuid: string) => {
  await request({ url: `${CANDIDATES_ENDPOINT}/${uuid}`, method: "delete" });
};
