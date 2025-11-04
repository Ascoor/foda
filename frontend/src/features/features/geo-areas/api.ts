import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { GeoArea } from "@/types";
import type { GeoAreaFormData } from "./types";

const GEO_AREAS_ENDPOINT = API_ENDPOINTS.elections.geoAreas;

export const fetchGeoAreas = async (
  params: Record<string, unknown> = {},
): Promise<GeoArea[]> => {
  const res = await request<{ data: GeoArea[] }>({
    url: GEO_AREAS_ENDPOINT,
    method: "get",
    params,
  });
  return res.data;
};

export const fetchGeoArea = async (uuid: string): Promise<GeoArea> => {
  const res = await request<{ data: GeoArea }>(
    {
      url: `${GEO_AREAS_ENDPOINT}/${uuid}`,
      method: "get",
    },
    { useCache: true },
  );
  return res.data;
};

export const createGeoArea = async (payload: GeoAreaFormData) => {
  const res = await request<{ data: GeoArea }>({
    url: GEO_AREAS_ENDPOINT,
    method: "post",
    data: payload,
  });
  return res.data;
};

export const updateGeoArea = async (uuid: string, payload: GeoAreaFormData) => {
  const res = await request<{ data: GeoArea }>({
    url: `${GEO_AREAS_ENDPOINT}/${uuid}`,
    method: "put",
    data: payload,
  });
  return res.data;
};

export const deleteGeoArea = async (uuid: string) => {
  await request({ url: `${GEO_AREAS_ENDPOINT}/${uuid}`, method: "delete" });
};
