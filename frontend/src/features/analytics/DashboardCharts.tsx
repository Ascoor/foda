import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import type {
  RegionAnalytics,
  ReportDistributionSlice,
  SupportTrendPoint,
} from './types';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--destructive))',
];

interface DashboardChartsProps {
  regions: RegionAnalytics[];
  trends: SupportTrendPoint[];
  distribution: ReportDistributionSlice[];
}

const tooltipStyles = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  color: 'hsl(var(--foreground))',
};

export const DashboardCharts = ({ regions, trends, distribution }: DashboardChartsProps) => {
  const regionDataset = useMemo(
    () =>
      regions.map((region) => ({
        name: region.region,
        activeAgents: region.active_agents,
        totalVoters: region.total_voters,
      })),
    [regions],
  );

  const trendDataset = useMemo(
    () =>
      trends.map((trend) => ({
        date: trend.date,
        support: trend.support_score_avg,
      })),
    [trends],
  );

  const distributionDataset = useMemo(
    () =>
      distribution.map((slice, index) => ({
        ...slice,
        fill: COLORS[index % COLORS.length],
      })),
    [distribution],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="glass-card border-primary/20 col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gradient-primary">
            Active agents by region
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionDataset}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyles} />
              <Bar dataKey="activeAgents" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-card border-secondary/20 col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gradient-secondary">
            Support score trends
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendDataset}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyles} />
              <Line
                type="monotone"
                dataKey="support"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-card border-accent/20 col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gradient-accent">
            Report types distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip contentStyle={tooltipStyles} />
              <Pie
                data={distributionDataset}
                dataKey="count"
                nameKey="type"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={4}
              >
                {distributionDataset.map((entry, index) => (
                  <Cell key={`slice-${entry.type}-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
