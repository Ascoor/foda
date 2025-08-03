import { AnalyticsData } from './types';

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    kpis: [
      { name: 'visitors', value: Math.floor(Math.random() * 1000) },
      { name: 'signups', value: Math.floor(Math.random() * 500) },
      { name: 'active', value: Math.floor(Math.random() * 300) },
    ],
    heatmap: Array.from({ length: 48 }, () => Math.random()),
    funnel: [
      { name: 'Visited', value: 1000 },
      { name: 'Registered', value: 400 },
      { name: 'Active', value: 200 },
    ],
  };
};
