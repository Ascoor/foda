import { useEffect, useMemo } from 'react';
import { initDashboardI18n } from './i18n';
import { themePalettes, useDashboardStore } from './store';

const i18n = initDashboardI18n();

const applyThemeToDocument = (theme, palette) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (root.dataset.theme !== theme) {
    root.dataset.theme = theme;
  }
  root.classList.toggle('dark', theme === 'night');
  root.style.setProperty('--dashboard-accent-primary', palette.accent.primary);
  root.style.setProperty('--dashboard-accent-secondary', palette.accent.secondary);
  root.style.setProperty('--dashboard-accent-tertiary', palette.accent.tertiary);
  root.style.setProperty('--dashboard-card-shadow', theme === 'night'
    ? '0px 28px 80px rgba(88, 28, 135, 0.35)'
    : '0px 24px 60px rgba(14, 165, 233, 0.18)');
  root.style.setProperty('--dashboard-card-blur', '24px');
};

const applyLanguageToDocument = (language) => {
  if (typeof document === 'undefined') return;
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  if (document.body) {
    document.body.style.fontFamily = language === 'ar'
      ? '"Cairo", system-ui, sans-serif'
      : '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }
};

export const useTheme = () => {
  const theme = useDashboardStore((state) => state.theme);
  const setTheme = useDashboardStore((state) => state.setTheme);
  const toggleTheme = useDashboardStore((state) => state.toggleTheme);

  const palette = useMemo(
    () => themePalettes[theme] || themePalettes.day,
    [theme]
  );

  useEffect(() => {
    applyThemeToDocument(theme, palette);
  }, [theme, palette]);

  return {
    theme,
    palette,
    setTheme,
    toggleTheme
  };
};

export const useLanguage = () => {
  const language = useDashboardStore((state) => state.language);
  const setLanguage = useDashboardStore((state) => state.setLanguage);
  const toggleLanguage = useDashboardStore((state) => state.toggleLanguage);

  useEffect(() => {
    applyLanguageToDocument(language);
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return {
    language,
    setLanguage,
    toggleLanguage,
    i18n
  };
};

export const useSidebar = () => {
  const sidebarOpen = useDashboardStore((state) => state.sidebarOpen);
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);
  const setSidebarOpen = useDashboardStore((state) => state.setSidebarOpen);

  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen
  };
};

export const useDashboardFilters = () => {
  const filters = useDashboardStore((state) => state.filters);
  const setFilter = useDashboardStore((state) => state.setFilter);

  return {
    filters,
    setFilter
  };
};
