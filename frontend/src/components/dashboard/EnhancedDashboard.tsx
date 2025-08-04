import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { 
  Vote, UserCheck, Users, Activity, CheckCircle, BarChart3, 
  TrendingUp, MapPin, Calendar, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeDataRenderer } from '@/components/ui/SafeDataRenderer';
import { MapVisualization } from '@/components/ui/MapVisualization';
import { StatsCard } from '@/modules/dashboard/components/StatsCard';
import { ProgressChart } from '@/modules/dashboard/components/ProgressChart';
import { ActivityFeed } from '@/modules/dashboard/components/ActivityFeed';
import { useApi } from '@/lib/api';
import { fetchGeoAreas } from '@/modules/geo-areas/api';
import { safeArray, createSafeApiResponse } from '@/lib/safeData';
import { toast } from '@/hooks/use-toast';

interface DashboardData {
  stats: Record<string, { value: number; change?: string; trend?: 'up' | 'down' }>;
  activities: Array<{ id: number; type: string; title: string; time: string }>;
  progress: {
    registration: number;
    verification: number;
    campaign: number;
    voting: number;
    overall: number;
    remaining: number;
  };
  turnout: number[];
}

const AnimatedCounter = ({ 
  value, 
  duration = 2000 
}: { 
  value: number; 
  duration?: number; 
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

const KPICard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color = 'primary' 
}: {
  title: string;
  value: number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ElementType;
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}) => {
  const colorClasses = {
    primary: 'from-primary to-primary-glow text-primary-foreground',
    secondary: 'from-secondary to-secondary-glow text-secondary-foreground',
    accent: 'from-accent to-accent-glow text-accent-foreground',
    success: 'from-success to-green-400 text-white'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-card group cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`
          p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}
          shadow-lg group-hover:shadow-xl transition-all duration-300
        `}>
          <Icon className="h-6 w-6" />
        </div>
        
        {change && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${trend === 'up' ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'}
          `}>
            <TrendingUp className={`h-3 w-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
          <AnimatedCounter value={value} />
        </h3>
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
    </motion.div>
  );
};

export const EnhancedDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  // Dashboard data query
  const { 
    data: dashboardData, 
    loading: dashboardLoading, 
    error: dashboardError,
    execute: refetchDashboard 
  } = useApi<DashboardData>({ 
    url: '/dashboard', 
    method: 'GET' 
  });
  
  // GeoAreas data query
  const { 
    data: geoAreasData, 
    isLoading: geoAreasLoading, 
    error: geoAreasError 
  } = useQuery({
    queryKey: ['geo-areas'],
    queryFn: fetchGeoAreas,
  });
  
  useEffect(() => {
    refetchDashboard()
      .then(() => toast({ description: t('dashboard.load_success') }))
      .catch(() => toast({ variant: 'destructive', description: t('dashboard.load_error') }));
  }, [refetchDashboard, t]);
  
  const safeGeoAreas = safeArray(geoAreasData);
  const safeDashboardData = dashboardData || {
    stats: {},
    activities: [],
    progress: { registration: 0, verification: 0, campaign: 0, voting: 0, overall: 0, remaining: 0 },
    turnout: []
  };
  
  const statsConfig = [
    { key: 'total_elections', icon: Vote, color: 'primary' as const, title: t('dashboard.total_elections') },
    { key: 'active_voters', icon: UserCheck, color: 'secondary' as const, title: t('dashboard.active_voters') },
    { key: 'total_candidates', icon: Users, color: 'accent' as const, title: t('dashboard.total_candidates') },
    { key: 'committees_count', icon: Activity, color: 'success' as const, title: t('dashboard.committees_count') },
  ];
  
  const progressData = [
    { label: t('dashboard.registration'), value: safeDashboardData.progress.registration, color: 'primary' as const },
    { label: t('dashboard.verification'), value: safeDashboardData.progress.verification, color: 'secondary' as const },
    { label: t('dashboard.campaign'), value: safeDashboardData.progress.campaign, color: 'accent' as const },
    { label: t('dashboard.voting'), value: safeDashboardData.progress.voting, color: 'success' as const },
  ];
  
  const activities = safeArray(safeDashboardData.activities).map(activity => ({
    ...activity,
    icon: Vote // You can map specific icons based on activity type
  }));
  
  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"
      >
        <div className="text-center py-8">
          <motion.h1 
            className="text-4xl font-bold mb-2 neon-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {t('dashboard.welcome')}
          </motion.h1>
          <p className="text-muted-foreground text-lg">{t('dashboard.subtitle')}</p>
        </div>
      </motion.div>
      
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <KPICard
              title={stat.title}
              value={safeDashboardData.stats[stat.key]?.value || 0}
              change={safeDashboardData.stats[stat.key]?.change}
              trend={safeDashboardData.stats[stat.key]?.trend}
              icon={stat.icon}
              color={stat.color}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <SafeDataRenderer
            data={progressData}
            loading={dashboardLoading}
            error={dashboardError}
            onRetry={refetchDashboard}
            loadingMessage={t('dashboard.loading_progress')}
          >
            {(data) => (
              <ProgressChart 
                data={data} 
                overall={safeDashboardData.progress.overall} 
                remaining={safeDashboardData.progress.remaining} 
              />
            )}
          </SafeDataRenderer>
        </motion.div>
        
        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.5 }}
        >
          <SafeDataRenderer
            data={activities}
            loading={dashboardLoading}
            error={dashboardError}
            onRetry={refetchDashboard}
            loadingMessage={t('dashboard.loading_activities')}
          >
            {(data) => <ActivityFeed activities={data} />}
          </SafeDataRenderer>
        </motion.div>
      </div>
      
      {/* Map Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6 }}
      >
        <SafeDataRenderer
          data={safeGeoAreas}
          loading={geoAreasLoading}
          error={geoAreasError}
          loadingMessage={t('geo_areas.loading')}
          emptyTitle={t('geo_areas.no_areas')}
          emptyDescription={t('geo_areas.no_areas_description')}
        >
          {(data) => (
            <MapVisualization 
              geoAreas={data}
              onAreaClick={(area) => {
                toast({ 
                  description: `${t('geo_areas.selected')}: ${area.name}` 
                });
              }}
            />
          )}
        </SafeDataRenderer>
      </motion.div>
      
      {/* Turnout Heatmap */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.7 }}
        className="glass-card"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            {t('dashboard.voter_turnout')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SafeDataRenderer
            data={safeDashboardData.turnout}
            loading={dashboardLoading}
            error={dashboardError}
            loadingMessage={t('dashboard.loading_turnout')}
          >
            {(turnoutData) => (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                {turnoutData.map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.02 }}
                    className={`
                      aspect-square rounded-lg glass-button relative overflow-hidden
                      ${value > 70 ? 'bg-success/20 border-success' : 
                        value > 50 ? 'bg-primary/20 border-primary' : 
                        value > 30 ? 'bg-accent/20 border-accent' : 
                        'bg-muted/20 border-muted'}
                      hover:scale-110 transition-transform cursor-pointer
                    `}
                    title={`${t('dashboard.area', { number: i + 1 })}: ${value}%`}
                  >
                    <div className="absolute inset-0 bg-current opacity-10" />
                    <div className="relative z-10 flex items-center justify-center h-full">
                      <span className="text-xs font-medium">{value}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </SafeDataRenderer>
        </CardContent>
      </motion.div>
    </div>
  );
};