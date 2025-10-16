import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Vote, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { PieChart } from './Charts/PieChart';
import { LineChart } from './Charts/LineChart';
import { BarChart } from './Charts/BarChart';
import { AreaChart } from './Charts/AreaChart';
import MapSection from './MapSection';
import FloatingActions from './FloatingActions';
import GlassCard from './GlassCard';
import { statCards, voteDistribution, participationTrend, partyOverview, turnoutByDistrict } from './data';
import { useTheme } from './hooks';

const iconMap = {
  Vote,
  TrendingUp,
  Users,
  BarChart3
};

export const DashboardContent = ({
  cards = statCards,
  pieData = voteDistribution,
  lineData = participationTrend,
  barData = partyOverview,
  areaData = turnoutByDistrict
}) => {
  const { theme, palette } = useTheme();
  const { t } = useTranslation();

  const preparedCards = useMemo(() => cards, [cards]);

  const iconAccent = theme === 'night'
    ? 'bg-white/20 text-slate-900 shadow-[0_12px_30px_rgba(59,130,246,0.35)]'
    : 'bg-white/70 text-slate-900 shadow-[0_12px_30px_rgba(45,212,191,0.35)]';

  return (
    <div className={`relative min-h-screen ${palette.background} transition-colors duration-700`}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.18),transparent_45%)]" />
      <motion.main
        initial={{ opacity: 0, filter: 'blur(18px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 px-6 pb-24 pt-36 lg:px-10 lg:pt-40"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <motion.section layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {preparedCards.map((card, index) => {
              const Icon = iconMap[card.icon] || Vote;
              return (
                <GlassCard
                  key={card.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  layout
                  hoverLift
                  className={`p-6 ${palette.text}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm uppercase tracking-[0.2em] opacity-70 font-semibold">
                        {t(card.id)}
                      </p>
                      <h3 className="text-3xl font-bold tracking-tight">{card.value}</h3>
                      <p className="text-xs opacity-60">
                        {t(card.deltaLabel, { defaultValue: card.deltaLabel })}
                      </p>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-0 rounded-full bg-white/40 blur-2xl" />
                      <span className={`relative inline-flex h-12 w-12 items-center justify-center rounded-full ${iconAccent}`}>
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="mt-6 flex items-center gap-2 text-xs font-medium"
                  >
                    <span className="text-emerald-400">{card.trend}</span>
                    <span className="opacity-60">{t(card.deltaLabel, { defaultValue: card.deltaLabel })}</span>
                  </motion.div>
                </GlassCard>
              );
            })}
          </motion.section>

          <motion.section layout className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <GlassCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              layout
              className={`p-6 ${palette.text}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('voteResults')}</h3>
              </header>
              <PieChart data={pieData} />
            </GlassCard>

            <GlassCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              layout
              className={`p-6 ${palette.text}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('participationRate')}</h3>
              </header>
              <LineChart data={lineData} />
            </GlassCard>

            <GlassCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              layout
              className={`p-6 ${palette.text}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('campaignOverview')}</h3>
              </header>
              <BarChart data={barData} />
            </GlassCard>

            <GlassCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              layout
              className={`p-6 ${palette.text}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('turnoutByDistrict')}</h3>
              </header>
              <AreaChart data={areaData} />
            </GlassCard>
          </motion.section>

          <motion.section layout className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <GlassCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              layout
              className={`xl:col-span-2 p-6 ${palette.text}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('mapTitle')}</h3>
              </header>
              <MapSection />
            </GlassCard>

            <GlassCard
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              layout
              className={`flex flex-col gap-4 p-6 ${palette.text}`}
            >
              <h3 className="text-lg font-semibold tracking-tight">{t('floatingActions')}</h3>
              <p className="text-sm opacity-70">
                Trigger critical workflows instantly with contextual quick actions tailored to Mansoura election monitoring teams.
              </p>
              <div className="flex flex-col gap-3">
                {preparedCards.slice(0, 3).map((item) => (
                  <div
                    key={`summary-${item.id}`}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 ${theme === 'night' ? 'bg-white/15 text-white' : 'bg-white/70 text-slate-900 shadow-sm'}`}
                  >
                    <span className="text-sm font-semibold uppercase tracking-wide opacity-80">{t(item.id)}</span>
                    <span className="text-lg font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.section>
        </div>
      </motion.main>

      <FloatingActions />
    </div>
  );
};

export default DashboardContent;
