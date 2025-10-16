import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PieChart, Map, Settings, BarChart3, Users, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { useSidebar, useTheme } from './hooks';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { id: 'analytics', icon: PieChart, labelKey: 'analytics' },
  { id: 'map', icon: Map, labelKey: 'map' },
  { id: 'reports', icon: FileText, labelKey: 'reports' },
  { id: 'team', icon: Users, labelKey: 'analytics' },
  { id: 'settings', icon: Settings, labelKey: 'settings' }
];

export const Sidebar = () => {
  const { sidebarOpen } = useSidebar();
  const { palette, theme } = useTheme();
  const { t } = useTranslation();

  const hoverText = theme === 'night' ? 'hover:text-white' : 'hover:text-slate-900';
  const iconBackground = theme === 'night'
    ? 'bg-white/10 text-white'
    : 'bg-white/70 text-slate-700 shadow-sm';

  return (
    <motion.aside
      initial={{ x: -120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="pointer-events-none fixed top-[7.5rem] left-6 z-30 flex items-start"
    >
      <GlassCard
        as={motion.nav}
        layout
        animate={{ width: sidebarOpen ? 232 : 92 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`pointer-events-auto overflow-hidden ${palette.text}`}
      >
        <ul className="flex flex-col py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`group flex w-full items-center gap-4 px-6 py-3 text-sm font-medium transition-colors ${hoverText}`}
                  title={t(item.labelKey)}
                >
                  <span className={`relative inline-flex h-10 w-10 items-center justify-center rounded-2xl ${iconBackground}`}>
                    <Icon className="w-5 h-5" />
                    <span className="absolute inset-0 rounded-2xl bg-cyan-400/40 opacity-0 blur-lg transition-opacity group-hover:opacity-100" />
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
      </GlassCard>
    </motion.aside>
  );
};

export default Sidebar;
