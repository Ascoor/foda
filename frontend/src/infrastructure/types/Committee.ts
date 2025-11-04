import type { BaseEntity, Nullable } from "./common";

export type CommitteeType = "central" | "regional" | "local";

export interface Committee extends BaseEntity {
  name: string;
  type: CommitteeType;
  election_uuid: string;
  geo_area_uuid?: Nullable<string>;
  location?: string | null;
  geo_area_id?: string | null;
  geo_area_name?: string | null;
  chair_uuid?: Nullable<string>;
  vice_chair_uuid?: Nullable<string>;
  contact_email?: string | null;
  contact_phone?: string | null;
  notes?: string | null;
}
