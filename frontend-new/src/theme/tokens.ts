export const spacing = {
  none: "0px",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
} as const;

export const typography = {
  fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "24px",
    display: "32px",
  },
} as const;

export const elevations = {
  card: "0 8px 24px rgba(15, 23, 42, 0.08)",
  popover: "0 12px 32px rgba(15, 23, 42, 0.12)",
  modal: "0 20px 40px rgba(15, 23, 42, 0.18)",
} as const;

export const durations = {
  instant: "75ms",
  fast: "150ms",
  normal: "250ms",
  slow: "400ms",
} as const;

export const radii = {
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  pill: "999px",
} as const;

export const tokens = {
  spacing,
  typography,
  elevations,
  durations,
  radii,
} as const;

export type ThemeTokens = typeof tokens;
