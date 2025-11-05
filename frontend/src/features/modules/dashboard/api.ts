import type { FeatureCollection } from "geojson";
import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { CampaignIdentifier } from "@/infrastructure/shared/lib/campaign";

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
