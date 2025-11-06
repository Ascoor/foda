export interface DashboardStatSummary {
  value: number;
  change?: string;
  trend?: "up" | "down";
}

export interface DashboardProgressSummary {
  registration: number;
  verification: number;
  campaign: number;
  voting: number;
  overall: number;
  remaining: number;
}

export interface DashboardActivityItem {
  id: number;
  type: string;
  title: string;
  time: string;
}

export interface DashboardOverviewResponse {
  stats: Record<string, DashboardStatSummary>;
  progress: DashboardProgressSummary;
  activities: DashboardActivityItem[];
  turnout: number[];
}
