import type { BaseEntity } from "./common";
import type { GeoArea } from "./GeoArea";

export type ElectionStatus = "draft" | "scheduled" | "active" | "archived";

export interface ElectionPhase {
  name: string;
  starts_at: string;
  ends_at: string;
}

export interface Election extends BaseEntity {
  name: string;
  code: string;
  description?: string | null;
  status: ElectionStatus;
  cycle_year: number;
  phases: ElectionPhase[];
  default_geo_scope: GeoArea["uuid"] | null;
}
