import { request } from "@/infrastructure/shared/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/shared/lib/endpoints";
import type { CampaignIdentifier } from "@/infrastructure/shared/lib/campaign";
import type { ActivitiesResponse, ActivityFilters } from "./types";

export const fetchActivities = async (
  filters: ActivityFilters = {},
  campaignId?: CampaignIdentifier | null,
) => {
  if (!campaignId) {
    throw new Error("Cannot load activities without an active campaign");
  }
  return request<ActivitiesResponse>({
    url: API_ENDPOINTS.campaigns.activities(campaignId),
    method: "get",
    params: filters,
  });
};
