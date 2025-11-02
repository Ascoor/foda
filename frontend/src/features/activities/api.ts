import { request } from "@/shared/lib/api";
import { API_ENDPOINTS } from "@/shared/lib/endpoints";
import type { CampaignIdentifier } from "@/shared/lib/campaign";
import type { ActivitiesResponse, ActivityFilters } from "./types";

export const fetchActivities = async (
  filters: ActivityFilters = {},
  campaignId?: CampaignIdentifier | null,
) =>
  request<ActivitiesResponse>({
    url: API_ENDPOINTS.campaigns.activities(campaignId),
    method: "get",
    params: filters,
  });
