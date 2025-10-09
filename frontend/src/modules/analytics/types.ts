export interface RegionAnalytics {
  area_id: number;
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

export interface AnalyticsResponse {
  regions: RegionAnalytics[];
  support_trends: SupportTrendPoint[];
  report_distribution: ReportDistributionSlice[];
  summary: AnalyticsSummary;
  generated_at: string;
}

export interface AnalyticsFilters {
  areaId?: number;
  from?: string;
  to?: string;
}
