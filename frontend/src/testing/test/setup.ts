import "@testing-library/jest-dom";
import "@/infrastructure/i18n";
import i18n from "@/infrastructure/i18n";
import { vi } from "vitest";
import type { ReactNode } from "react";

i18n.changeLanguage("en");

const mockUseLanguage = vi.hoisted(() => vi.fn());

vi.mock("@/infrastructure/shared/contexts/LanguageContext", () => ({
  useLanguage: mockUseLanguage,
  LanguageProvider: ({ children }: { children: ReactNode }) => children,
}));

mockUseLanguage.mockReturnValue({
  language: "en",
  direction: "ltr",
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
