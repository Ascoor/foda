import type { BaseEntity, Nullable } from "./common";

export type VoterStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "deceased"
  | "moved";

export interface VoterContact {
  phone_primary?: string | null;
  phone_secondary?: string | null;
  email?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
}

export interface Voter extends BaseEntity {
  full_name: string;
  national_id: string;
  gender: "male" | "female" | "other";
  birth_date: string;
  status: VoterStatus;
  election_uuid: string;
  geo_area_uuid?: Nullable<string>;
  committee_uuid?: Nullable<string>;
  contact: VoterContact;
  mobile?: string | null;
  email?: string | null;
  area_name?: string;
  committee_name?: string;
  registered_at?: Nullable<string>;
  last_interaction_at?: Nullable<string>;
  tags?: string[];
}
