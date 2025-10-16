import React from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCcw, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDashboardStore, themePalettes } from './store';

const actions = [
  { id: 'reportsCTA', icon: Download, intent: 'primary' },
  { id: 'alertsCTA', icon: Send, intent: 'accent' },
  { id: 'refreshCTA', icon: RefreshCcw, intent: 'ghost' }
];

export const FloatingActions = () => {
  const { theme } = useDashboardStore();
  const palette = themePalettes[theme] || themePalettes.day;
  const { t } = useTranslation();

  const getActionClass = (intent) => {
    switch (intent) {
      case 'primary':
        return 'bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-900 shadow-lg shadow-cyan-500/30';
      case 'accent':
        return 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/40';
      default:
        return 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xl border border-white/30';
    }
  };

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
      className="fixed bottom-10 right-10 z-30"
    >
      <div className={`flex flex-col gap-3 ${palette.text}`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${getActionClass(action.intent)}`}
            >
              <Icon className="w-4 h-4" />
              <span>{t(action.id)}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default FloatingActions;
