import { request } from "@/shared/lib/api";
import { API_ENDPOINTS } from "@/shared/lib/endpoints";
import type { AnalyticsFilters, AnalyticsResponse } from "./types";

type AnalyticsEnvelope = {
  data: AnalyticsResponse;
};

export const fetchAnalytics = async (
  filters: AnalyticsFilters = {},
): Promise<AnalyticsResponse> => {
  const response = await request<AnalyticsEnvelope>(
    {
      url: API_ENDPOINTS.analytics.metrics,
      method: "get",
      params: filters,
    },
    { useCache: true },
  );

  return response.data;
};
