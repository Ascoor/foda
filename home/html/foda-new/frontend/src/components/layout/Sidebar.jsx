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

  const containerClass = theme === 'night'
    ? 'bg-white/10 border-white/20 text-white/80 shadow-[0_25px_80px_rgba(14,165,233,0.2)]'
    : 'bg-white/70 border-white/60 text-slate-700 shadow-[0_20px_60px_rgba(15,118,110,0.15)]';
  const hoverText = theme === 'night' ? 'hover:text-white' : 'hover:text-slate-900';

  return (
    <motion.aside
      initial={{ x: -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-y-0 left-0 z-30 flex items-start pt-28 px-4"
    >
      <motion.nav
        animate={{ width: sidebarOpen ? 220 : 84 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`overflow-hidden rounded-3xl backdrop-blur-2xl ${containerClass}`}
      >
        <ul className="flex flex-col py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`group flex items-center gap-4 w-full px-6 py-3 text-sm font-medium transition-colors ${hoverText}`}
                >
                  <span className="relative">
                    <Icon className="w-5 h-5" />
                    <span className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-100 bg-cyan-400/50 transition-opacity" />
                  </span>
                  <AnimatePresence>
                    {sidebarOpen && (
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
