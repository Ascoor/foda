import type { ComponentType } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityFeed } from '../components/ActivityFeed';

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: ComponentType<{ className?: string }>;
}

interface ActivityPanelProps {
  activities: ActivityItem[];
  loading: boolean;
  heading: string;
  description: string;
}

export const ActivityPanel = ({ activities, loading, heading, description }: ActivityPanelProps) => (
  <Card className="h-full overflow-hidden">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold tracking-tight">{heading}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? <Skeleton className="h-72 w-full rounded-3xl" /> : <ActivityFeed activities={activities} />}
    </CardContent>
  </Card>
);
