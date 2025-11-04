export const COLOR_TOKENS = {
  primary: { hex: "#FF5733", hsl: "11 100% 60%" },
  secondary: { hex: "#33FF57", hsl: "131 100% 60%" },
  accent: { hex: "#5733FF", hsl: "251 100% 60%" },
  background: { hex: "#F5F5F5", hsl: "0 0% 96%" },
  textPrimary: { hex: "#333333", hsl: "0 0% 20%" },
  textSecondary: { hex: "#777777", hsl: "0 0% 47%" },
} as const;

export const SUPPORTING_TOKENS = {
  textMuted: { hex: "#999999", hsl: "0 0% 60%" },
  border: { hex: "#D1D1D1", hsl: "0 0% 82%" },
  input: { hex: "#E0E0E0", hsl: "0 0% 88%" },
  success: { hex: "#1FAA59", hsl: "142 76% 36%" },
  warning: { hex: "#FFB347", hsl: "45 100% 52%" },
  destructive: { hex: "#FF4D4F", hsl: "0 85% 55%" },
} as const;

export type PaletteToken = keyof typeof COLOR_TOKENS;
