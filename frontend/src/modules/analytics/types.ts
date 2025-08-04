export interface KPIData {
  totalVoters: number;
  totalCandidates: number;
  totalCommittees: number;
  totalObservations: number;
  voterTurnoutPercentage: number;
  activeElections: number;
}

export interface AreaAnalytics {
  areaId: string;
  areaName: string;
  voterTurnout: number;
  registeredVoters: number;
  totalObservations: number;
  committeesCount: number;
}

export interface CandidateAnalytics {
  party: string;
  candidateCount: number;
  percentage: number;
}

export interface ActivityData {
  date: string;
  observations: number;
  registrations: number;
  campaigns: number;
}

export interface AnalyticsData {
  kpis: KPIData;
  areaAnalytics: AreaAnalytics[];
  candidateDistribution: CandidateAnalytics[];
  weeklyActivity: ActivityData[];
  lastUpdated: string;
}

export interface AnalyticsFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  areaId?: string;
  electionId?: string;
}