import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, SunMedium, MoonStar, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { useLanguage, useSidebar, useTheme } from './hooks';

export const Header = () => {
  const { theme, palette, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { toggleSidebar } = useSidebar();
  const { t } = useTranslation();
  const isRTL = language === 'ar';

  const controlButtonClass = theme === 'night'
    ? 'p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-xl border border-white/20'
    : 'p-2.5 rounded-full bg-white/80 text-slate-700 hover:bg-white shadow-sm transition-colors backdrop-blur-xl border border-white/60';
  const searchPadding = isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4';
  const searchClass = theme === 'night'
    ? `w-full ${searchPadding} py-2.5 rounded-full bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal-200/60 placeholder:text-slate-300 text-sm`
    : `w-full ${searchPadding} py-2.5 rounded-full bg-white/70 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300/60 text-sm shadow-sm`;
  const searchIconPlacement = isRTL ? 'right-4' : 'left-4';
  const searchIconColor = theme === 'night' ? 'text-slate-200/80' : 'text-slate-500';

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="pointer-events-none fixed top-6 left-1/2 z-40 w-full px-4 sm:px-6"
      style={{ transform: 'translateX(-50%)' }}
    >
      <GlassCard
        as={motion.div}
        layout
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className={`pointer-events-auto mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 gap-4 ${palette.text}`}
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

        <div className="hidden flex-1 items-center gap-3 md:flex max-w-md">
          <div className="relative w-full">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${searchIconColor} ${searchIconPlacement}`} />
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
            onClick={toggleLanguage}
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
      </GlassCard>
    </motion.header>
  );
};

export default Header;
