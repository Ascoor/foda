import { apiClient, ApiResponse } from "@/shared/api/config";
import {
  AnalyticsKpiDTO,
  AnalyticsTimeSeriesPointDTO,
  HeatMapCellDTO,
  VolunteerProgressPointDTO,
} from "@/shared/api/dtos";

export type KeyPerformanceIndicator = AnalyticsKpiDTO;

export type VoterStatPoint = {
  month: string;
  supporters: number;
  undecided: number;
};

export type VolunteerProgressPoint = VolunteerProgressPointDTO;

export type HeatMapCell = {
  neighborhood: string;
  contactRate: number;
};

type AnalyticsKpiResponse = ApiResponse<AnalyticsKpiDTO[]>;
type VoterStatsResponse = ApiResponse<AnalyticsTimeSeriesPointDTO[]>;
type VolunteerProgressResponse = ApiResponse<VolunteerProgressPointDTO[]>;
type HeatMapResponse = ApiResponse<HeatMapCellDTO[]>;

const mapVoterPoint = (dto: AnalyticsTimeSeriesPointDTO): VoterStatPoint => ({
  month: dto.label,
  supporters: dto.supporters,
  undecided: dto.undecided,
});

const mapHeatCell = (dto: HeatMapCellDTO): HeatMapCell => ({
  neighborhood: dto.neighborhood,
  contactRate: dto.contact_rate,
});

export const analyticsService = {
  async getKpis() {
    const { data } = await apiClient.get<AnalyticsKpiResponse>("/analytics/kpis");
    return data.data ?? [];
  },
  async getVoterStats() {
    const { data } = await apiClient.get<VoterStatsResponse>("/analytics/voter-trends");
    return (data.data ?? []).map(mapVoterPoint);
  },
  async getVolunteerProgress() {
    const { data } = await apiClient.get<VolunteerProgressResponse>(
      "/analytics/volunteer-progress",
    );
    return data.data ?? [];
  },
  async getHeatMap() {
    const { data } = await apiClient.get<HeatMapResponse>("/analytics/geo-heatmap");
    return (data.data ?? []).map(mapHeatCell);
  },
};
