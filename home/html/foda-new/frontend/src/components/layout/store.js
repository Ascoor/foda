import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'day';
  const stored = window.localStorage.getItem('dashboard-theme');
  if (stored) return stored;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'night' : 'day';
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  return window.localStorage.getItem('dashboard-language') || 'en';
};

export const themePalettes = {
  day: {
    id: 'day',
    name: 'day',
    background: 'bg-gradient-to-br from-teal-50 via-sky-50 to-white',
    card: 'bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl shadow-cyan-100/30',
    text: 'text-slate-800',
    accent: {
      primary: '#1FC5C0',
      secondary: '#38BDF8',
      tertiary: '#2563EB'
    },
    mapTiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },
  night: {
    id: 'night',
    name: 'night',
    background: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900',
    card: 'bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-indigo-900/50',
    text: 'text-slate-100',
    accent: {
      primary: '#7C3AED',
      secondary: '#22D3EE',
      tertiary: '#A855F7'
    },
    mapTiles: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  }
};

export const useDashboardStore = create((set, get) => ({
  theme: getInitialTheme(),
  language: getInitialLanguage(),
  sidebarOpen: false,
  filters: {
    selectedDistrict: 'all'
  },
  setTheme: (theme) => {
    const value = theme === 'night' ? 'night' : 'day';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dashboard-theme', value);
    }
    set({ theme: value });
  },
  toggleTheme: () => {
    const next = get().theme === 'day' ? 'night' : 'day';
    get().setTheme(next);
  },
  setLanguage: (lng) => {
    const value = lng === 'ar' ? 'ar' : 'en';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dashboard-language', value);
    }
    set({ language: value });
  },
  toggleLanguage: () => {
    const next = get().language === 'ar' ? 'en' : 'ar';
    get().setLanguage(next);
  },
  setSidebarOpen: (open) => set({ sidebarOpen: Boolean(open) }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  }))
}));
