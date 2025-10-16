import { useTranslation } from 'react-i18next';
import { Vote, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { SmartHeader } from '@/components/SmartHeader';
import { FloatingSidebar } from '@/components/FloatingSidebar';
import { DashboardCard } from '@/components/DashboardCard';
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { LineChartComponent } from '@/components/charts/LineChartComponent';
import { BarChartComponent } from '@/components/charts/BarChartComponent';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Mountain fog overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          background: 'var(--gradient-mountain-fog)',
          mixBlendMode: 'soft-light'
        }} 
      />
      
      <SmartHeader />
      <FloatingSidebar />
      
      <main className="pt-32 pb-12 px-6 ml-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-10">
            <DashboardCard
              title={t('totalVotes')}
              value="43,592"
              icon={Vote}
              delay={0}
            />
            <DashboardCard
              title={t('participationRate')}
              value="73%"
              icon={TrendingUp}
              delay={0.08}
            />
            <DashboardCard
              title={t('analytics')}
              value="8,234"
              icon={Users}
              delay={0.16}
            />
            <DashboardCard
              title={t('reports')}
              value="156"
              icon={BarChart3}
              delay={0.24}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            <DashboardCard
              title={t('voteResults')}
              delay={0.32}
            >
              <PieChartComponent />
            </DashboardCard>

            <DashboardCard
              title={t('participationRate')}
              delay={0.4}
            >
              <LineChartComponent />
            </DashboardCard>

            <DashboardCard
              title={t('campaignOverview')}
              delay={0.48}
            >
              <BarChartComponent />
            </DashboardCard>

            <DashboardCard
              title={t('analytics')}
              delay={0.56}
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center p-4 rounded-[20px] relative overflow-hidden group"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.05))',
                    boxShadow: 'inset 2px 2px 6px hsla(var(--primary) / 0.1)'
                  }}
                >
                  <span className="text-sm font-semibold text-foreground">Active Campaigns</span>
                  <span className="text-xl font-extrabold text-primary drop-shadow-sm">12</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex justify-between items-center p-4 rounded-[20px] relative overflow-hidden group"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(var(--accent) / 0.08), hsl(var(--accent) / 0.05))',
                    boxShadow: 'inset 2px 2px 6px hsla(var(--accent) / 0.1)'
                  }}
                >
                  <span className="text-sm font-semibold text-foreground">Pending Reviews</span>
                  <span className="text-xl font-extrabold text-accent drop-shadow-sm">8</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex justify-between items-center p-4 rounded-[20px] relative overflow-hidden group"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(var(--secondary) / 0.3), hsl(var(--secondary) / 0.2))',
                    boxShadow: 'inset 2px 2px 6px hsla(var(--secondary) / 0.15)'
                  }}
                >
                  <span className="text-sm font-semibold text-foreground">Completed</span>
                  <span className="text-xl font-extrabold text-foreground drop-shadow-sm">45</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/10 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
