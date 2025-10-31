import type { FeatureCollection, Point } from "geojson";

import { request } from "@shared/lib/api";
import { API_ENDPOINTS } from "@shared/lib/endpoints";

export interface LiveMapQueryParams {
  campaignId?: string | null;
  electionId?: string | null;
  limit?: number;
}

const normalizeParams = (params?: LiveMapQueryParams) => {
  const query: Record<string, string> = {};
  if (!params) {
    return query;
  }

  if (params.campaignId) {
    query.campaignId = params.campaignId;
  }

  if (params.electionId) {
    query.electionId = params.electionId;
  }

  if (typeof params.limit === "number") {
    query.limit = params.limit.toString();
  }

  return query;
};

export const fetchCommitteeGeo = async (params?: LiveMapQueryParams) =>
  request<FeatureCollection<Point, Record<string, any>>>(
    {
      url: API_ENDPOINTS.dashboard.committeeGeo,
      method: "get",
      params: normalizeParams(params),
    },
    { useCache: true },
  );

export const fetchRecentActivityGeo = async (params?: LiveMapQueryParams) =>
  request<FeatureCollection<Point, Record<string, any>>>(
    {
      url: API_ENDPOINTS.dashboard.recentActivityGeo,
      method: "get",
      params: normalizeParams(params),
    },
    { useCache: false },
  );
