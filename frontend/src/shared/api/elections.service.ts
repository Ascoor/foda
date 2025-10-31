import { http } from "./http";

export type Election = {
  id: number;
  name: string;
  coverUrl?: string;
  phase: "upcoming" | "running" | "closed";
  startAt?: string;
  endAt?: string;
};

export const electionsApi = {
  listByCampaign: (campaignId: number) =>
    http.get<Election[]>(`/campaigns/${campaignId}/elections`).then((r) => r.data),
};
