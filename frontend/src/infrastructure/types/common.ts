export interface BaseEntity {
  id: number | string;
  uuid: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  encrypted_fields?: string[];
}

export interface Timestamped {
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type Nullable<T> = T | null;
