import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  Star,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: any;
  color: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

export const ProfessionalDashboard = () => {
  const { t } = useTranslation();

  const stats: StatCard[] = [
    {
      title: t('dashboard.total_users'),
      value: '12,543',
      change: 12.5,
      icon: Users,
      color: 'primary'
    },
    {
      title: t('dashboard.revenue'),
      value: '$45,231',
      change: 8.2,
      icon: DollarSign,
      color: 'secondary'
    },
    {
      title: t('dashboard.growth'),
      value: '23.1%',
      change: 4.3,
      icon: TrendingUp,
      color: 'accent'
    },
    {
      title: t('dashboard.activity'),
      value: '1,834',
      change: -2.1,
      icon: Activity,
      color: 'success'
    }
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      user: 'Ahmed Mohammed',
      action: 'Created new project',
      time: '2 minutes ago',
      type: 'success'
    },
    {
      id: '2',
      user: 'Sara Ali',
      action: 'Updated user settings',
      time: '15 minutes ago',
      type: 'info'
    },
    {
      id: '3',
      user: 'Omar Hassan',
      action: 'System maintenance required',
      time: '1 hour ago',
      type: 'warning'
    }
  ];

  const projects = [
    { name: 'E-commerce Platform', progress: 85, status: 'In Progress', team: 8 },
    { name: 'Mobile App', progress: 92, status: 'Review', team: 5 },
    { name: 'Analytics Dashboard', progress: 67, status: 'Development', team: 12 },
    { name: 'Payment Gateway', progress: 45, status: 'Planning', team: 6 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('dashboard.overview_description')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('dashboard.date_range')}
          </Button>
          <Button variant="floating" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('dashboard.generate_report')}
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={cardVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          
          return (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="glass-card border-0 hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                    <Icon className={`h-4 w-4 text-${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center mt-2">
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4 text-success mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
                    )}
                    <span className={`text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {t('dashboard.from_last_month')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects Overview */}
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                {t('dashboard.active_projects')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {project.team} team members
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{project.progress}%</div>
                    </div>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={cardVariants}>
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t('dashboard.recent_activity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-success' :
                    activity.type === 'warning' ? 'bg-warning' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={cardVariants}>
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>{t('dashboard.quick_actions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: t('dashboard.add_user'), color: 'primary' },
                { icon: MessageSquare, label: t('dashboard.send_message'), color: 'secondary' },
                { icon: Eye, label: t('dashboard.view_analytics'), color: 'accent' },
                { icon: Star, label: t('dashboard.feature_request'), color: 'warning' }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="glass"
                      className="w-full h-20 flex flex-col gap-2 hover:shadow-glow"
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};