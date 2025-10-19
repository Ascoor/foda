import type { AnalyticsSnapshot, AnalyticsScope } from "@/types";

export interface RegionAnalytics {
  geo_area_uuid: string;
  region: string;
  total_voters: number;
  active_agents: number;
  reports_today: number;
  support_score_avg: number;
}

export interface SupportTrendPoint {
  date: string;
  support_score_avg: number;
}

export interface ReportDistributionSlice {
  type: string;
  count: number;
}

export interface AnalyticsSummary {
  support_percentage: number;
  turnout_estimate: number;
  coverage_gap: number;
}

export interface AnalyticsResponse extends AnalyticsSnapshot {
  scope: AnalyticsScope;
  scope_uuid: string;
  generated_at: string;
  summary: AnalyticsSummary;
  regions: RegionAnalytics[];
  support_trends: SupportTrendPoint[];
  report_distribution: ReportDistributionSlice[];
}

export interface AnalyticsFilters {
  scope?: AnalyticsScope;
  scope_uuid?: string;
  from?: string;
  to?: string;
}
