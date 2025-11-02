import type { FeatureCollection } from "geojson";
import { request } from "@/shared/lib/api";
import { API_ENDPOINTS } from "@/shared/lib/endpoints";

export const fetchCommitteeGeo = async () =>
  request<FeatureCollection>(
    { url: API_ENDPOINTS.dashboard.committeeGeo, method: "get" },
    { useCache: true },
  );

export const fetchRecentActivityGeo = async (params?: { limit?: number }) =>
  request<FeatureCollection>({
    url: API_ENDPOINTS.dashboard.recentActivityGeo,
    method: "get",
    params,
  });
