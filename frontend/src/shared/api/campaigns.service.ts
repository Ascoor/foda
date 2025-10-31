import { http } from "./http";

export type Campaign = {
  id: number;
  name: string;
  coverUrl?: string;
  status: "draft" | "active" | "archived";
  area?: { id: number; name: string };
};

export const campaignsApi = {
  list: (query?: { status?: string; areaId?: number; q?: string; page?: number }) =>
    http
      .get<{ data: Campaign[]; meta: unknown }>("/campaigns", { params: query })
      .then((r) => r.data),
  create: (dto: { name: string; areaId: number; coverUrl?: string }) =>
    http.post<Campaign>("/campaigns", dto).then((r) => r.data),
  get: (id: number) => http.get<Campaign>(`/campaigns/${id}`).then((r) => r.data),
};
