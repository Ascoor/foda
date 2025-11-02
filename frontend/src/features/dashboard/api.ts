import type { FeatureCollection } from "geojson";
import { request } from "@/shared/lib/api";
import { API_ENDPOINTS } from "@/shared/lib/endpoints";
import type { CampaignIdentifier } from "@/shared/lib/campaign";

export const fetchCommitteeGeo = async (campaignId?: CampaignIdentifier | null) =>
  request<FeatureCollection>(
    { url: API_ENDPOINTS.dashboard.committeeGeo(campaignId), method: "get" },
    { useCache: true },
  );

export const fetchRecentActivityGeo = async (
  params?: { limit?: number },
  campaignId?: CampaignIdentifier | null,
) =>
  request<FeatureCollection>({
    url: API_ENDPOINTS.dashboard.recentActivityGeo(campaignId),
    method: "get",
    params,
  });
