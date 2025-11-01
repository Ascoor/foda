export type Id = string;

export type GeoAreaType =
  | "governorate"
  | "markaz"
  | "qesm"
  | "city"
  | "neighborhood";

export type GeoArea = {
  id: Id;
  code: string;
  type?: GeoAreaType;
};

export type Committee = {
  id: Id;
  code: string;
  name: string;
  geo_area_id: Id;
};

export type Campaign = {
  id: Id;
  name: string;
  status?: "draft" | "active" | "paused" | "archived";
  geo_root_id?: Id | null;
};

export type KPIResponse = {
  campaign: Campaign;
  kpis: {
    activities_last7: number;
    sms_today: number;
  };
};
