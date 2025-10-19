import type { GeoArea as GeoAreaEntity, GeoAreaType } from "@/types";

export type GeoArea = GeoAreaEntity;

export interface GeoAreaFormData {
  name: string;
  code: string;
  type: GeoAreaType;
  parent_uuid?: string | null;
  boundary?: GeoAreaEntity["boundary"];
  population?: number | null;
  metadata?: Record<string, unknown>;
}
