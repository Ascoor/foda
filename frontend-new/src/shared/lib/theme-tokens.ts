export type ThemeMode = "light" | "dark";

const BRAND_COLORS = {
  primary: "#2563EB",
  secondary: "#7C3AED",
  accent: "#FACC15",
} as const;

const NEUTRAL_COLORS = {
  lightBackground: "#F3F4F6",
  darkBackground: "#0F172A",
  lightForeground: "#0F172A",
  darkForeground: "#E2E8F0",
} as const;

type ThemeDefinition = {
  background: string;
  foreground: string;
  surface: string;
  surfaceSecondary: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ring: string;
  overlayFrom: string;
  overlayTo: string;
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
};

export const themeTokens: Record<ThemeMode, ThemeDefinition> = {
  light: {
    background: NEUTRAL_COLORS.lightBackground,
    foreground: NEUTRAL_COLORS.lightForeground,
    surface: "#FFFFFF",
    surfaceSecondary: "#E2E8F0",
    muted: "#64748B",
    mutedForeground: "#475569",
    border: "#CBD5F5",
    ring: BRAND_COLORS.primary,
    overlayFrom: "#2563EB24",
    overlayTo: "#7C3AED1A",
    shadow: {
      sm: "0 18px 38px -24px rgba(37, 99, 235, 0.25)",
      md: "0 32px 82px -48px rgba(15, 23, 42, 0.28)",
      lg: "0 52px 128px -60px rgba(37, 99, 235, 0.22)",
    },
  },
  dark: {
    background: NEUTRAL_COLORS.darkBackground,
    foreground: NEUTRAL_COLORS.darkForeground,
    surface: "#16213D",
    surfaceSecondary: "#1E293B",
    muted: "#94A3B8",
    mutedForeground: "#CBD5F5",
    border: "#243045",
    ring: BRAND_COLORS.primary,
    overlayFrom: "#2563EB33",
    overlayTo: "#7C3AED26",
    shadow: {
      sm: "0 18px 32px -24px rgba(7, 12, 24, 0.55)",
      md: "0 36px 72px -42px rgba(7, 12, 24, 0.65)",
      lg: "0 52px 128px -60px rgba(37, 99, 235, 0.24)",
    },
  },
};

const hexToRgb = (hex: string) => {
  const sanitized = hex.replace("#", "");
  const value = sanitized.length === 3
    ? sanitized
        .split("")
        .map((char) => char + char)
        .join("")
    : sanitized;

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return { r, g, b };
};

const rgbToHsl = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
      default:
        h = 0;
    }
  }

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  const hue = Math.round((h * 60 + 360) % 360);
  const satPercent = Math.round(saturation * 100);
  const lightPercent = Math.round(lightness * 100);

  return `${hue} ${satPercent}% ${lightPercent}%`;
};

const hexToHsl = (hex: string) => rgbToHsl(hexToRgb(hex));

const getReadableTextColor = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;

  return luminance > 0.54 ? NEUTRAL_COLORS.lightForeground : NEUTRAL_COLORS.darkForeground;
};

export const getThemeCssVariables = (mode: ThemeMode) => {
  const theme = themeTokens[mode];
  const primaryForeground = getReadableTextColor(BRAND_COLORS.primary);
  const secondaryForeground = getReadableTextColor(BRAND_COLORS.secondary);
  const accentForeground = getReadableTextColor(BRAND_COLORS.accent);
  const surfaceForeground = getReadableTextColor(theme.surface);
  const surfaceSecondaryForeground = getReadableTextColor(theme.surfaceSecondary);

  return {
    "--primary": hexToHsl(BRAND_COLORS.primary),
    "--primary-foreground": hexToHsl(primaryForeground),
    "--secondary": hexToHsl(BRAND_COLORS.secondary),
    "--secondary-foreground": hexToHsl(secondaryForeground),
    "--accent": hexToHsl(BRAND_COLORS.accent),
    "--accent-foreground": hexToHsl(accentForeground),
    "--background": hexToHsl(theme.background),
    "--foreground": hexToHsl(theme.foreground),
    "--surface": hexToHsl(theme.surface),
    "--surface-foreground": hexToHsl(surfaceForeground),
    "--surface-secondary": hexToHsl(theme.surfaceSecondary),
    "--surface-secondary-foreground": hexToHsl(surfaceSecondaryForeground),
    "--muted": hexToHsl(theme.muted),
    "--muted-foreground": hexToHsl(theme.mutedForeground),
    "--border": hexToHsl(theme.border),
    "--ring": hexToHsl(theme.ring),
    "--overlay-from": hexToHsl(theme.overlayFrom),
    "--overlay-to": hexToHsl(theme.overlayTo),
    "--shadow-sm": theme.shadow.sm,
    "--shadow-md": theme.shadow.md,
    "--shadow-lg": theme.shadow.lg,
  } as Record<string, string>;
};
