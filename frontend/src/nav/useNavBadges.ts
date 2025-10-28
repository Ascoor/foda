import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useNotifications } from '@shared/contexts/NotificationContext';

export type NavBadgeCounts = Record<string, number>;

const buildCounts = (sources: string[], alerts: number): NavBadgeCounts => {
  const counts: NavBadgeCounts = {};
  sources.forEach((source) => {
    if (source === 'alerts' || source === 'inbox') {
      counts[source] = alerts;
      return;
    }
    counts[source] = 0;
  });
  return counts;
};

export const useNavBadgeCounts = (sources: Iterable<string>) => {
  const sourceList = useMemo(() => Array.from(new Set(sources)), [sources]);

  let alerts = 0;
  try {
    const notifications = useNotifications();
    alerts = notifications.unreadCount;
  } catch {
    alerts = 0;
  }

  const query = useQuery({
    queryKey: ['nav', 'badge-counts', sourceList.join('|'), alerts],
    queryFn: async () => buildCounts(sourceList, alerts),
    initialData: () => buildCounts(sourceList, alerts),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return query.data ?? {};
};

export default useNavBadgeCounts;
