import { create } from "zustand";

type ThemeMode = "day" | "night";
type Language = "ar" | "en";

type FloatingState = {
  theme: ThemeMode;
  language: Language;
  sidebarOpen: boolean;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
};

export const useFloatingExperienceStore = create<FloatingState>((set) => ({
  theme: "day",
  language: "ar",
  sidebarOpen: true,
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "day" ? "night" : "day" })),
  setLanguage: (language) => set({ language }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
