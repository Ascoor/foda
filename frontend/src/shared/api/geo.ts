import { api } from "./http";
import type { Committee, GeoArea } from "./types";

export async function fetchGovernorates(): Promise<GeoArea[]> {
  const { data } = await api.get<GeoArea[]>("/api/v1/geo/governorates");
  return data;
}

export async function fetchCircles(governorateId: string): Promise<GeoArea[]> {
  const { data } = await api.get<GeoArea[]>("/api/v1/geo/circles", {
    params: { governorate_id: governorateId },
  });
  return data;
}

export async function fetchCommittees(geoAreaId: string): Promise<Committee[]> {
  const { data } = await api.get<Committee[]>("/api/v1/geo/committees", {
    params: { geo_area_id: geoAreaId },
  });
  return data;
}
