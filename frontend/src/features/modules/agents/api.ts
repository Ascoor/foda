import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { Agent } from "@/types";
import type { AgentFilters, AgentFormData } from "./types";

type PaginatedResponse<T> = {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
  };
};

const AGENTS_ENDPOINT = API_ENDPOINTS.crm.agents;
export const mockCommittees = [{ id: "placeholder", name: "Committee 001" }];

export const fetchAgents = async (
  filters: AgentFilters & { page?: number; per_page?: number } = {},
) => {
  const response = await request<PaginatedResponse<Agent>>(
    {
      url: AGENTS_ENDPOINT,
      method: "get",
      params: filters,
    },
    { useCache: true },
  );
  return response.data;
};

export const createAgent = async (data: AgentFormData) => {
  const response = await request<{ data: Agent }>({
    url: AGENTS_ENDPOINT,
    method: "post",
    data,
  });
  return response.data;
};

export const updateAgent = async (
  uuid: string,
  data: Partial<AgentFormData>,
) => {
  const response = await request<{ data: Agent }>({
    url: `${AGENTS_ENDPOINT}/${uuid}`,
    method: "put",
    data,
  });
  return response.data;
};

export const deleteAgent = async (uuid: string) => {
  await request({ url: `${AGENTS_ENDPOINT}/${uuid}`, method: "delete" });
};

export const assignAgent = async (
  uuid: string,
  assignment: AgentFormData["assignment"],
) => {
  await request({
    url: `${AGENTS_ENDPOINT}/${uuid}/assign`,
    method: "post",
    data: assignment,
  });
};

export const exportAgents = async () =>
  request<Blob>({
    url: `${AGENTS_ENDPOINT}/export`,
    method: "get",
    responseType: "blob",
  });
