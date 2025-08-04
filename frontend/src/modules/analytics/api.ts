import { request } from '../../lib/api';
import { AnalyticsData, AnalyticsFilters } from './types';

export const fetchAnalytics = async (
  filters: AnalyticsFilters = {}
): Promise<AnalyticsData> => {
  // Mock data for now - replace with real API call when backend is ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    kpis: {
      totalVoters: 15420,
      totalCandidates: 247,
      totalCommittees: 89,
      totalObservations: 156,
      voterTurnoutPercentage: 78.5,
      activeElections: 3
    },
    areaAnalytics: [
      { areaId: '1', areaName: 'Area 1', voterTurnout: 78, registeredVoters: 1200, totalObservations: 25, committeesCount: 12 },
      { areaId: '2', areaName: 'Area 2', voterTurnout: 65, registeredVoters: 980, totalObservations: 18, committeesCount: 8 },
      { areaId: '3', areaName: 'Area 3', voterTurnout: 82, registeredVoters: 1500, totalObservations: 32, committeesCount: 15 },
      { areaId: '4', areaName: 'Area 4', voterTurnout: 71, registeredVoters: 1100, totalObservations: 22, committeesCount: 10 },
      { areaId: '5', areaName: 'Area 5', voterTurnout: 89, registeredVoters: 1350, totalObservations: 28, committeesCount: 14 }
    ],
    candidateDistribution: [
      { party: 'Party A', candidateCount: 45, percentage: 36.6 },
      { party: 'Party B', candidateCount: 38, percentage: 30.9 },
      { party: 'Party C', candidateCount: 25, percentage: 20.3 },
      { party: 'Independent', candidateCount: 15, percentage: 12.2 }
    ],
    weeklyActivity: [
      { date: '2024-01-01', observations: 12, registrations: 25, campaigns: 8 },
      { date: '2024-01-02', observations: 19, registrations: 32, campaigns: 12 },
      { date: '2024-01-03', observations: 15, registrations: 28, campaigns: 15 },
      { date: '2024-01-04', observations: 22, registrations: 35, campaigns: 10 },
      { date: '2024-01-05', observations: 18, registrations: 40, campaigns: 18 },
      { date: '2024-01-06', observations: 25, registrations: 45, campaigns: 22 },
      { date: '2024-01-07', observations: 20, registrations: 38, campaigns: 16 }
    ],
    lastUpdated: new Date().toISOString()
  };
};

// Future API integration - uncomment when backend is ready
/*
export const fetchAnalytics = async (
  filters: AnalyticsFilters = {}
): Promise<AnalyticsData> => {
  const { data } = await request<{ data: AnalyticsData }>({
    url: '/ec/analytics',
    method: 'get',
    params: filters,
  });
  return data;
};
*/

export const exportAnalyticsReport = async (format: 'pdf' | 'excel' = 'pdf'): Promise<void> => {
  await request({
    url: `/ec/analytics/export?format=${format}`,
    method: 'get',
    responseType: 'blob'
  });
};