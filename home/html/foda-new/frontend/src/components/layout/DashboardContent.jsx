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
import { statCards, voteDistribution, participationTrend, partyOverview, turnoutByDistrict } from './data';
import { useDashboardStore, themePalettes } from './store';
import { initDashboardI18n } from './i18n';

initDashboardI18n();

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
  const { theme } = useDashboardStore();
  const palette = themePalettes[theme] || themePalettes.day;
  const { t } = useTranslation();

  const preparedCards = useMemo(() => cards, [cards]);

  return (
    <div className={`relative min-h-screen ${palette.background} transition-colors duration-700`}>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-indigo-500/20" />
      <motion.main
        initial="initial"
        animate="animate"
        className="relative z-10 pt-36 sm:pt-40 pb-20 pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-48 lg:pr-12 transition-all duration-500"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {preparedCards.map((card, index) => {
              const Icon = iconMap[card.icon] || Vote;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={`relative overflow-hidden rounded-3xl p-6 ${palette.card}`}
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
                      <span className="absolute inset-0 rounded-full bg-white/30 blur-2xl" />
                      <span className="relative inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/30 text-slate-900">
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
                  <div className="absolute -right-6 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-br from-transparent via-white/20 to-white/0" />
                </motion.div>
              );
            })}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`rounded-3xl p-6 ${palette.card}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('voteResults')}</h3>
              </header>
              <PieChart data={pieData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`rounded-3xl p-6 ${palette.card}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('participationRate')}</h3>
              </header>
              <LineChart data={lineData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`rounded-3xl p-6 ${palette.card}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('campaignOverview')}</h3>
              </header>
              <BarChart data={barData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`rounded-3xl p-6 ${palette.card}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('turnoutByDistrict')}</h3>
              </header>
              <AreaChart data={areaData} />
            </motion.div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`xl:col-span-2 rounded-3xl p-6 ${palette.card}`}
            >
              <header className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold tracking-tight">{t('mapTitle')}</h3>
              </header>
              <MapSection />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className={`rounded-3xl p-6 flex flex-col gap-4 ${palette.card}`}
            >
              <h3 className="text-lg font-semibold tracking-tight">{t('floatingActions')}</h3>
              <p className="text-sm opacity-70">
                Trigger critical workflows instantly with contextual quick actions tailored to Mansoura election monitoring teams.
              </p>
              <div className="flex flex-col gap-3">
                {preparedCards.slice(0, 3).map((item) => (
                  <div
                    key={`summary-${item.id}`}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl ${theme === 'night' ? 'bg-white/20 text-white' : 'bg-white/70 text-slate-900'}`}
                  >
                    <span className="text-sm font-semibold uppercase tracking-wide opacity-80">{t(item.id)}</span>
                    <span className="text-lg font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </motion.main>

      <FloatingActions />
    </div>
  );
};

export default DashboardContent;
