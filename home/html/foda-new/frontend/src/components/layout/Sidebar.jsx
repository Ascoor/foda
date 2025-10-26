import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PieChart, Map, Settings, BarChart3, Users, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDashboardStore } from './store';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { id: 'analytics', icon: PieChart, labelKey: 'analytics' },
  { id: 'map', icon: Map, labelKey: 'map' },
  { id: 'reports', icon: FileText, labelKey: 'reports' },
  { id: 'team', icon: Users, labelKey: 'analytics' },
  { id: 'settings', icon: Settings, labelKey: 'settings' }
];

export const Sidebar = () => {
  const { sidebarOpen, theme } = useDashboardStore();
  const { t } = useTranslation();
  const [hovering, setHovering] = React.useState(false);

  const containerClass = theme === 'night'
    ? 'bg-white/15 border-white/20 text-white/80 shadow-[0_45px_120px_rgba(88,28,135,0.55)]'
    : 'bg-white/70 border-white/50 text-slate-700 shadow-[0_40px_110px_rgba(14,165,233,0.25)]';
  const hoverText = theme === 'night' ? 'hover:text-white' : 'hover:text-slate-900';
  const glowClass = theme === 'night'
    ? 'from-indigo-500/30 via-purple-500/10 to-transparent'
    : 'from-cyan-300/40 via-emerald-200/20 to-transparent';
  const isExpanded = sidebarOpen || hovering;

  const handleFocus = () => setHovering(true);
  const handleBlur = () => setHovering(false);

  return (
    <motion.aside
      initial={{ x: -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-32 sm:top-36 bottom-12 left-4 sm:left-6 z-30 flex"
    >
      <motion.nav
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        animate={{ width: isExpanded ? 264 : 92 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className={`relative overflow-hidden rounded-[32px] backdrop-blur-3xl px-3 py-6 ${containerClass}`}
        aria-label={t('dashboardNavigation', { defaultValue: 'Dashboard navigation' })}
      >
        <div
          className={`pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br ${glowClass} blur-2xl opacity-70 transition-opacity duration-500`}
        />
        <ul className="flex flex-col py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`group flex items-center gap-4 w-full px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${hoverText} ${theme === 'night' ? 'hover:bg-white/10' : 'hover:bg-white/60'}`}
                >
                  <span className="relative">
                    <Icon className="w-5 h-5" />
                    <span className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-100 bg-cyan-400/50 transition-opacity" />
                  </span>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className="whitespace-nowrap"
                      >
                        {t(item.labelKey)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </motion.aside>
  );
};

export default Sidebar;
