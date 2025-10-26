import type { MultiPolygon, Polygon } from "geojson";

export type ElectoralZoneStatus = "مغطاة" | "غير مغطاة" | "أولوية قصوى";

export interface ElectoralZone {
  id: string;
  name: string;
  status: ElectoralZoneStatus;
  voters: number;
  volunteers: number;
  committees: number;
  geometry?: Polygon | MultiPolygon;
}
