import '@testing-library/jest-dom';
import '@/i18n';
import i18n from '@/i18n';
import { vi } from 'vitest';

i18n.changeLanguage('en');

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    direction: 'ltr',
    toggleLanguage: vi.fn(),
    setLanguage: vi.fn(),
  }),
  LanguageProvider: ({ children }: any) => children,
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserver;
