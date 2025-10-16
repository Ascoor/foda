import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, SunMedium, MoonStar, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDashboardStore, themePalettes } from './store';
import { initDashboardI18n } from './i18n';

initDashboardI18n();

export const Header = () => {
  const { theme, toggleTheme, language, setLanguage, toggleSidebar } = useDashboardStore();
  const palette = themePalettes[theme] || themePalettes.day;
  const { t, i18n } = useTranslation();

  const controlButtonClass = theme === 'night'
    ? 'p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors'
    : 'p-2.5 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow-sm transition-colors';
  const searchClass = theme === 'night'
    ? 'w-full pl-12 pr-4 py-2.5 rounded-full bg-white/20 focus:outline-none focus:ring-2 focus:ring-teal-200/60 placeholder:text-slate-300 text-sm'
    : 'w-full pl-12 pr-4 py-2.5 rounded-full bg-white/80 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300/60 text-sm shadow-sm';

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
      className={`fixed top-0 inset-x-0 z-40 px-6 lg:px-10 py-4 ${palette.text}`}
    >
      <div
        className={`w-full flex items-center justify-between rounded-3xl ${palette.card} px-6 py-4 gap-4`}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className={controlButtonClass}
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
              placeholder={t('search') || 'Search'}
              className={searchClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={controlButtonClass}
            aria-label={t('toggleTheme')}
          >
            {theme === 'night' ? <SunMedium className="w-5 h-5" /> : <MoonStar className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className={controlButtonClass}
            aria-label={t('toggleLanguage')}
          >
            <Languages className="w-5 h-5" />
          </button>
          <button
            type="button"
            className={`${controlButtonClass} relative`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
