import type { FeatureCollection, Point } from "geojson";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { request } from "@shared/lib/api";
import { API_ENDPOINTS } from "@shared/lib/endpoints";
import { safeArray } from "@shared/lib/utils";
import {
  fetchCommitteeGeo,
  fetchRecentActivityGeo,
  type LiveMapQueryParams,
} from "./live-map.service";

export interface DashboardOverviewResponse {
  stats?: Record<
    string,
    {
      value?: number;
      change?: string;
      trend?: "up" | "down" | string | null;
    }
  > | null;
  progress?: {
    registration?: number | null;
    verification?: number | null;
    campaign?: number | null;
    voting?: number | null;
    overall?: number | null;
    remaining?: number | null;
  } | null;
  turnout?: number[] | null;
}

export interface DashboardActivitiesResponse {
  activities?: Array<{
    id?: number | string;
    type?: string | null;
    title?: string | null;
    time?: string | null;
  }> | null;
}

export interface LiveMapResponse {
  committees: FeatureCollection<Point, Record<string, any>>;
  activities: FeatureCollection<Point, Record<string, any>>;
}

interface DashboardQueryParams {
  campaignId?: string | null;
  electionId?: string | null;
}

const buildQueryParams = ({ campaignId, electionId }: DashboardQueryParams) => {
  const params: Record<string, string> = {};
  if (campaignId) {
    params.campaignId = campaignId;
  }
  if (electionId) {
    params.electionId = electionId;
  }
  return params;
};

const DASHBOARD_QUERY_STALE_TIME = 30_000;
const DASHBOARD_QUERY_GC_TIME = 5 * 60_000;

export const fetchDashboardOverview = async (
  params: DashboardQueryParams,
) =>
  request<DashboardOverviewResponse & DashboardActivitiesResponse>({
    url: API_ENDPOINTS.dashboard.overview,
    method: "get",
    params: buildQueryParams(params),
  });

export const useDashboardStats = (
  campaignId: string | null | undefined,
  electionId: string | null | undefined,
) =>
  useQuery({
    queryKey: [
      "dashboard",
      "overview",
      campaignId ?? "__none__",
      electionId ?? "__none__",
    ],
    queryFn: () => fetchDashboardOverview({ campaignId, electionId }),
    select: (response) => ({
      stats: response?.stats ?? null,
      progress: response?.progress ?? null,
      turnout: safeArray(response?.turnout ?? []),
    }),
    enabled: Boolean(campaignId && electionId),
    staleTime: DASHBOARD_QUERY_STALE_TIME,
    gcTime: DASHBOARD_QUERY_GC_TIME,
  });

export const useRecentActivities = (
  campaignId: string | null | undefined,
  electionId: string | null | undefined,
) =>
  useQuery({
    queryKey: [
      "dashboard",
      "recent-activities",
      campaignId ?? "__none__",
      electionId ?? "__none__",
    ],
    queryFn: () => fetchDashboardOverview({ campaignId, electionId }),
    select: (response) => safeArray(response?.activities ?? []),
    enabled: Boolean(campaignId && electionId),
    staleTime: DASHBOARD_QUERY_STALE_TIME,
    gcTime: DASHBOARD_QUERY_GC_TIME,
  });

export const fetchLiveMapData = async (
  params: LiveMapQueryParams,
): Promise<LiveMapResponse> => {
  const [committees, activities] = await Promise.all([
    fetchCommitteeGeo(params),
    fetchRecentActivityGeo(params),
  ]);

  return { committees, activities };
};

export const useLiveMapData = (
  campaignId: string | null | undefined,
  electionId: string | null | undefined,
  { limit = 150 }: { limit?: number } = {},
) => {
  const params = useMemo(
    () => ({ campaignId, electionId, limit }),
    [campaignId, electionId, limit],
  );

  return useQuery({
    queryKey: [
      "dashboard",
      "live-map",
      campaignId ?? "__none__",
      electionId ?? "__none__",
      limit,
    ],
    queryFn: () => fetchLiveMapData(params),
    enabled: Boolean(campaignId && electionId),
    staleTime: DASHBOARD_QUERY_STALE_TIME,
    gcTime: DASHBOARD_QUERY_GC_TIME,
  });
};
