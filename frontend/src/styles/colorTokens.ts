export const COLOR_TOKENS = {
  primary: { hex: "#2563EB", hsl: "221 83% 53%" },
  secondary: { hex: "#7C3AED", hsl: "262 83% 58%" },
  accent: { hex: "#FACC15", hsl: "48 96% 53%" },
  background: { hex: "#F3F4F6", hsl: "220 14% 96%" },
  textPrimary: { hex: "#0F172A", hsl: "222 47% 11%" },
  textSecondary: { hex: "#4B5768", hsl: "215 16% 35%" },
} as const;

export const SUPPORTING_TOKENS = {
  textMuted: { hex: "#7E8A9A", hsl: "215 12% 55%" },
  border: { hex: "#CFD4DE", hsl: "220 18% 84%" },
  input: { hex: "#E0E4EB", hsl: "220 20% 90%" },
  success: { hex: "#16A34A", hsl: "142 76% 36%" },
  warning: { hex: "#F59E0B", hsl: "38 92% 50%" },
  destructive: { hex: "#DC2626", hsl: "0 72% 51%" },
} as const;

export type PaletteToken = keyof typeof COLOR_TOKENS;
