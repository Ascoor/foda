import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, SunMedium, MoonStar, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDashboardStore, themePalettes } from './store';
import { initDashboardI18n } from './i18n';

initDashboardI18n();

export const Header = () => {
  const { theme, toggleTheme, language, setLanguage, toggleSidebar, sidebarOpen } = useDashboardStore();
  const palette = themePalettes[theme] || themePalettes.day;
  const { t, i18n } = useTranslation();

  const controlButtonClass = theme === 'night'
    ? 'p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all duration-300 shadow-[0_8px_30px_rgba(124,58,237,0.35)] hover:shadow-[0_12px_40px_rgba(34,211,238,0.45)]'
    : 'p-2.5 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white shadow-[0_10px_30px_rgba(15,118,110,0.18)] transition-all duration-300';
  const searchClass = theme === 'night'
    ? 'w-full pl-12 pr-4 py-2.5 rounded-full bg-white/15 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-teal-200/60 placeholder:text-slate-300 text-sm text-white/90 transition-all duration-300'
    : 'w-full pl-12 pr-4 py-2.5 rounded-full bg-white/80 backdrop-blur-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300/60 text-sm shadow-sm transition-all duration-300';
  const haloClass = theme === 'night'
    ? 'from-indigo-500/40 via-purple-500/10 to-transparent'
    : 'from-teal-200/70 via-cyan-200/20 to-transparent';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.dataset.theme = theme;
      root.classList.toggle('dark', theme === 'night');
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`fixed top-4 sm:top-6 left-4 right-4 sm:left-6 sm:right-6 z-40 ${palette.text}`}
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="relative"
      >
        <div
          className={`pointer-events-none absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br ${haloClass} blur-2xl opacity-70 transition-opacity duration-500`}
        />
        <div
          className={`relative w-full flex items-center justify-between rounded-[28px] ${palette.card} px-6 sm:px-8 py-4 gap-4 shadow-[0_25px_60px_rgba(15,23,42,0.12)]`}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleSidebar}
              className={controlButtonClass}
              aria-label={t('toggleSidebar', { defaultValue: 'Toggle sidebar' })}
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-lg font-semibold tracking-wide">
                {t('dashboard')}
              </span>
              <span className="text-xs uppercase font-medium px-2 py-1 rounded-full bg-white/20">
                Dakahlia • Mansoura
              </span>
            </div>
          </div>

          <div className="flex-1 hidden md:flex items-center gap-3 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="search"
                placeholder={t('search', { defaultValue: 'Search' })}
                className={searchClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={controlButtonClass}
              aria-label={t('toggleTheme', { defaultValue: 'Toggle theme' })}
            >
              {theme === 'night' ? <SunMedium className="w-5 h-5" /> : <MoonStar className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className={controlButtonClass}
              aria-label={t('toggleLanguage', { defaultValue: 'Toggle language' })}
            >
              <Languages className="w-5 h-5" />
            </button>
            <button
              type="button"
              className={`${controlButtonClass} relative`}
              aria-label={t('notifications', { defaultValue: 'Notifications' })}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
