import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { GeoAreaData } from '@/data/mockGeoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserCheck, 
  Target, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface GeoAreaStatsProps {
  geoAreas: GeoAreaData[];
  className?: string;
}

const GeoAreaStats: React.FC<GeoAreaStatsProps> = ({ geoAreas, className = '' }) => {
  const { t } = useLanguage();

  // Calculate aggregate statistics
  const stats = React.useMemo(() => {
    const totalAreas = geoAreas.length;
    const totalVoters = geoAreas.reduce((sum, area) => sum + area.stats.totalVoters, 0);
    const totalRegistered = geoAreas.reduce((sum, area) => sum + area.stats.registeredVoters, 0);
    const totalVolunteers = geoAreas.reduce((sum, area) => sum + area.stats.activeVolunteers, 0);
    const totalCommittees = geoAreas.reduce((sum, area) => sum + area.stats.committees, 0);
    
    const avgCoverage = geoAreas.length > 0 
      ? geoAreas.reduce((sum, area) => sum + area.stats.coverage, 0) / geoAreas.length 
      : 0;

    const statusCounts = geoAreas.reduce((acc, area) => {
      acc[area.campaignStatus] = (acc[area.campaignStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAreas,
      totalVoters,
      totalRegistered,
      totalVolunteers,
      totalCommittees,
      avgCoverage,
      registrationRate: totalVoters > 0 ? (totalRegistered / totalVoters) * 100 : 0,
      statusCounts
    };
  }, [geoAreas]);

  const statCards = [
    {
      title: t('geo_areas.total_voters'),
      value: stats.totalVoters.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+12%'
    },
    {
      title: t('geo_areas.registered_voters'),
      value: stats.totalRegistered.toLocaleString(),
      icon: UserCheck,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      subtitle: `${stats.registrationRate.toFixed(1)}% ${t('common.of')} ${t('geo_areas.total_voters').toLowerCase()}`
    },
    {
      title: t('geo_areas.active_volunteers'),
      value: stats.totalVolunteers.toLocaleString(),
      icon: Target,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: '+8%'
    },
    {
      title: t('geo_areas.total_committees'),
      value: stats.totalCommittees.toLocaleString(),
      icon: MapPin,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  const coverageCard = {
    title: t('geo_areas.campaign_coverage'),
    value: `${stats.avgCoverage.toFixed(1)}%`,
    icon: TrendingUp,
    color: stats.avgCoverage >= 80 ? 'text-success' : stats.avgCoverage >= 60 ? 'text-warning' : 'text-destructive',
    bgColor: stats.avgCoverage >= 80 ? 'bg-success/10' : stats.avgCoverage >= 60 ? 'bg-warning/10' : 'bg-destructive/10'
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      {stat.trend && (
                        <Badge variant="secondary" className="text-xs text-success">
                          {stat.trend}
                        </Badge>
                      )}
                    </div>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.subtitle}
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Coverage and Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coverage Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${coverageCard.bgColor}`}>
                  <coverageCard.icon className={`h-5 w-5 ${coverageCard.color}`} />
                </div>
                {coverageCard.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{coverageCard.value}</span>
                  <Badge 
                    variant="outline" 
                    className={`${coverageCard.color} border-current`}
                  >
                    {stats.avgCoverage >= 80 ? 'Excellent' : stats.avgCoverage >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
                <Progress 
                  value={stats.avgCoverage} 
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground">
                  Average coverage across all geographic areas
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-info/10">
                  <AlertTriangle className="h-5 w-5 text-info" />
                </div>
                {t('geo_areas.campaign_status')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    status: 'covered', 
                    icon: CheckCircle, 
                    color: 'text-success', 
                    bgColor: 'bg-success/10',
                    borderColor: 'border-success/20'
                  },
                  { 
                    status: 'pending', 
                    icon: Clock, 
                    color: 'text-warning', 
                    bgColor: 'bg-warning/10',
                    borderColor: 'border-warning/20'
                  },
                  { 
                    status: 'high_priority', 
                    icon: AlertTriangle, 
                    color: 'text-destructive', 
                    bgColor: 'bg-destructive/10',
                    borderColor: 'border-destructive/20'
                  },
                  { 
                    status: 'uncovered', 
                    icon: MapPin, 
                    color: 'text-muted-foreground', 
                    bgColor: 'bg-muted/10',
                    borderColor: 'border-muted/20'
                  }
                ].map(({ status, icon: Icon, color, bgColor, borderColor }) => {
                  const count = stats.statusCounts[status] || 0;
                  const percentage = stats.totalAreas > 0 ? (count / stats.totalAreas) * 100 : 0;
                  
                  return (
                    <div 
                      key={status}
                      className={`flex items-center justify-between p-3 rounded-lg border ${bgColor} ${borderColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className="font-medium">
                          {t(`geo_areas.status.${status}`)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{count}</p>
                        <p className="text-xs text-muted-foreground">
                          {percentage.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GeoAreaStats;