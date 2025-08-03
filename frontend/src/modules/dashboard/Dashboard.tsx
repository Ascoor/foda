import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Users, 
  Vote, 
  UserCheck,
  BarChart3,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { ActivityFeed } from './components/ActivityFeed';
import { ProgressChart } from './components/ProgressChart';

const statsData = [
  {
    title: 'dashboard.total_elections',
    value: '12',
    change: '+2.5%',
    trend: 'up' as const,
    icon: Vote,
    color: 'primary' as const
  },
  {
    title: 'dashboard.active_voters',
    value: '45,231',
    change: '+12.3%',
    trend: 'up' as const,
    icon: UserCheck,
    color: 'secondary' as const
  },
  {
    title: 'dashboard.total_candidates',
    value: '89',
    change: '+5.1%',
    trend: 'up' as const,
    icon: Users,
    color: 'accent' as const
  },
  {
    title: 'dashboard.committees_count',
    value: '156',
    change: '+1.2%',
    trend: 'up' as const,
    icon: Activity,
    color: 'success' as const
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'election_created',
    title: 'Parliamentary Election 2024 created',
    time: '2 hours ago',
    icon: Vote
  },
  {
    id: 2,
    type: 'voters_imported',
    title: '1,245 voters imported to District 3',
    time: '4 hours ago',
    icon: UserCheck
  },
  {
    id: 3,
    type: 'candidate_registered',
    title: 'Ahmed Hassan registered as candidate',
    time: '6 hours ago',
    icon: Users
  },
  {
    id: 4,
    type: 'committee_assigned',
    title: 'Committee 12 assigned to Area North',
    time: '8 hours ago',
    icon: CheckCircle
  }
];

export const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor and manage your election processes with real-time insights
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <ProgressChart />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ActivityFeed activities={recentActivities} />
        </motion.div>
      </div>

      {/* Voter Turnout Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">{t('dashboard.voter_turnout')}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {Array.from({ length: 32 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + (i * 0.02) }}
              className={`
                aspect-square rounded-lg glass-button
                ${Math.random() > 0.3 ? 'bg-primary/20' : 'bg-muted/20'}
                hover:scale-110 transition-transform cursor-pointer
              `}
              title={`Area ${i + 1}: ${Math.floor(Math.random() * 100)}% turnout`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};