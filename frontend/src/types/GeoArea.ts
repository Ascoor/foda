import type { BaseEntity, Nullable } from "./common";

export type GeoAreaType =
  | "country"
  | "state"
  | "district"
  | "municipality"
  | "ward"
  | "precinct";

export interface GeoBoundary {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][];
}

export interface GeoArea extends BaseEntity {
  name: string;
  code: string;
  type: GeoAreaType;
  parent_uuid?: Nullable<string>;
  boundary?: GeoBoundary;
  population?: number | null;
  metadata?: Record<string, unknown>;
}
