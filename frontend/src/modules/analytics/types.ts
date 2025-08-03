export interface KPI {
  name: string;
  value: number;
}

export interface FunnelStep {
  name: string;
  value: number;
}

export interface AnalyticsData {
  kpis: KPI[];
  heatmap: number[];
  funnel: FunnelStep[];
}
