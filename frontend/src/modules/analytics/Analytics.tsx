import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Vote, 
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeDataRenderer } from '@/components/ui/SafeDataRenderer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from 'recharts';
import { safeArray, safeNumber } from '@/lib/safeData';
import { fetchAnalytics } from './api';
import { AnalyticsData } from './types';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--success))'];

interface KPICardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  description?: string;
}

const KPICard = ({ title, value, change, icon, description }: KPICardProps) => (
  <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-4 w-4 text-primary">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gradient-primary">{value}</div>
      {change !== undefined && (
        <p className={`text-xs ${change >= 0 ? 'text-success' : 'text-destructive'} flex items-center gap-1`}>
          <TrendingUp className="h-3 w-3" />
          {change > 0 ? '+' : ''}{change}%
        </p>
      )}
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

export const Analytics = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const analyticsData = await fetchAnalytics();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const mockData = {
    kpis: [
      { label: 'Total Voters', value: 15420, change: 12 },
      { label: 'Registered Candidates', value: 247, change: 8 },
      { label: 'Active Committees', value: 89, change: 5 },
      { label: 'Total Observations', value: 156, change: -3 }
    ],
    voterTurnout: [
      { area: 'Area 1', turnout: 78, registered: 1200 },
      { area: 'Area 2', turnout: 65, registered: 980 },
      { area: 'Area 3', turnout: 82, registered: 1500 },
      { area: 'Area 4', turnout: 71, registered: 1100 },
      { area: 'Area 5', turnout: 89, registered: 1350 }
    ],
    candidatesByParty: [
      { name: 'Party A', value: 45, color: COLORS[0] },
      { name: 'Party B', value: 38, color: COLORS[1] },
      { name: 'Party C', value: 25, color: COLORS[2] },
      { name: 'Independent', value: 15, color: COLORS[3] }
    ],
    weeklyActivity: [
      { day: 'Mon', observations: 12, registrations: 25, campaigns: 8 },
      { day: 'Tue', observations: 19, registrations: 32, campaigns: 12 },
      { day: 'Wed', observations: 15, registrations: 28, campaigns: 15 },
      { day: 'Thu', observations: 22, registrations: 35, campaigns: 10 },
      { day: 'Fri', observations: 18, registrations: 40, campaigns: 18 },
      { day: 'Sat', observations: 25, registrations: 45, campaigns: 22 },
      { day: 'Sun', observations: 20, registrations: 38, campaigns: 16 }
    ]
  };

  if (loading || error || !data) {
    return (
      <SafeDataRenderer
        data={data ? [data] : []}
        loading={loading}
        error={error}
        onRetry={() => window.location.reload()}
        emptyTitle="No analytics data"
        emptyDescription="Analytics data will appear here when available"
      >
        {() => <div />}
      </SafeDataRenderer>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">{t('analytics.title')}</h1>
          <p className="text-muted-foreground mt-1">Real-time insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Card className="glass-card border-success/20">
            <CardContent className="flex items-center gap-2 p-4">
              <Calendar className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Last Updated: {new Date().toLocaleDateString()}</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Voters"
          value={mockData.kpis[0].value.toLocaleString()}
          change={mockData.kpis[0].change}
          icon={<Users />}
          description="Registered voters across all areas"
        />
        <KPICard
          title="Active Candidates"
          value={mockData.kpis[1].value}
          change={mockData.kpis[1].change}
          icon={<Vote />}
          description="Currently registered candidates"
        />
        <KPICard
          title="Committees"
          value={mockData.kpis[2].value}
          change={mockData.kpis[2].change}
          icon={<MapPin />}
          description="Active voting committees"
        />
        <KPICard
          title="Observations"
          value={mockData.kpis[3].value}
          change={mockData.kpis[3].change}
          icon={<Activity />}
          description="Total recorded observations"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Voter Turnout by Area */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Voter Turnout by Area
            </CardTitle>
            <CardDescription>Percentage of registered voters participating</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.voterTurnout}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="area" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="turnout" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Candidate Distribution */}
        <Card className="glass-card border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-secondary" />
              Candidate Distribution
            </CardTitle>
            <CardDescription>Candidates by political affiliation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <RechartsPieChart 
                  data={mockData.candidatesByParty}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {mockData.candidatesByParty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {mockData.candidatesByParty.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Weekly Activity Trends
          </CardTitle>
          <CardDescription>Daily activity across different modules</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockData.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="observations" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--secondary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="campaigns" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Observations</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span>Registrations</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span>Campaigns</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};