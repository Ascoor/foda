export const themeTokens = {
  light: {
    background: "#f9fafb",
    foreground: "#111827",
    primary: "#2563eb",
    accent: "#7c3aed",
  },
  dark: {
    background: "#0f172a",
    foreground: "#f8fafc",
    primary: "#60a5fa",
    accent: "#c084fc",
  },
} as const;

export type ThemeMode = keyof typeof themeTokens;
