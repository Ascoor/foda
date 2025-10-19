import type { Election as ElectionEntity, ElectionStatus } from "@/types";

export type Election = ElectionEntity;

export interface ElectionFormData {
  name: string;
  code: string;
  description?: string | null;
  status?: ElectionStatus;
  cycle_year: number;
  phases: ElectionEntity["phases"];
  default_geo_scope?: string | null;
}

export interface ElectionFilters {
  search?: string;
  page?: number;
  per_page?: number;
  status?: ElectionStatus;
  cycle_year?: number;
}
