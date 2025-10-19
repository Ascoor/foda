import '@testing-library/jest-dom';
import '@/i18n';
import i18n from '@/i18n';
import { vi } from 'vitest';

i18n.changeLanguage('en');

const mockUseLanguage = vi.hoisted(() => vi.fn());

vi.mock('@/shared/contexts/LanguageContext', () => ({
  useLanguage: mockUseLanguage,
  LanguageProvider: ({ children }: any) => children,
}));

mockUseLanguage.mockReturnValue({
  language: 'en',
  direction: 'ltr',
  toggleLanguage: vi.fn(),
  setLanguage: vi.fn(),
  t: (key: string) => key,
});

(globalThis as any).__mockUseLanguage = mockUseLanguage;

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserver;
