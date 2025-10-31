import { useQuery } from "@tanstack/react-query";

import type { Election } from "@/types";
import { request } from "@shared/lib/api";
import { safeArray } from "@shared/lib/utils";

const electionRoute = (campaignId: string) =>
  `/api/v1/campaigns/${campaignId}/elections`;

export const fetchCampaignElections = async (
  campaignId: string,
): Promise<Election[]> => {
  if (!campaignId) {
    return [];
  }

  const response = await request<{ data?: Election[] }>({
    url: electionRoute(campaignId),
    method: "get",
    useCache: true,
  });

  return safeArray(response.data);
};

export const campaignElectionsKey = (campaignId: string | null | undefined) => [
  "campaigns",
  campaignId,
  "elections",
];

export const useElections = (campaignId: string | null | undefined) =>
  useQuery({
    queryKey: campaignElectionsKey(campaignId ?? null),
    queryFn: () => fetchCampaignElections(campaignId as string),
    enabled: Boolean(campaignId),
    staleTime: 5 * 60 * 1000,
  });
