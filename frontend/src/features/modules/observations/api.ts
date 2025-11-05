import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { Observation } from "./types";
import type { ObservationFilters, ObservationFormData } from "./types";

const OBSERVATIONS_ENDPOINT = API_ENDPOINTS.field.observations;

export const mockCommittees = [{ id: "placeholder", name: "Committee 001" }];

export const fetchObservations = async (
  params: ObservationFilters = {},
): Promise<Observation[]> => {
  const response = await request<{ data: Observation[] }>({
    url: OBSERVATIONS_ENDPOINT,
    method: "get",
    params,
  });
  return response.data;
};

export const createObservation = async (
  payload: ObservationFormData,
): Promise<Observation> => {
  const { data } = await request<{ data: Observation }>({
    url: OBSERVATIONS_ENDPOINT,
    method: "post",
    data: payload,
  });
  return data;
};

export const updateObservation = async (
  identifier: string | number,
  payload: Partial<ObservationFormData>,
): Promise<Observation> => {
  const { data } = await request<{ data: Observation }>({
    url: `${OBSERVATIONS_ENDPOINT}/${identifier}`,
    method: "put",
    data: payload,
  });
  return data;
};

export const deleteObservation = async (
  identifier: string | number,
): Promise<void> => {
  await request({
    url: `${OBSERVATIONS_ENDPOINT}/${identifier}`,
    method: "delete",
  });
};
