/**
 * Foda Design System - Theme Configuration
 * Professional design tokens for RTL/LTR bilingual dashboard
 */

export const designTokens = {
  // Brand Colors (HSL format for theming)
  colors: {
    primary: {
      base: "hsl(221 83% 53%)",
      glow: "hsl(221 90% 60%)",
      foreground: "hsl(0 0% 100%)",
    },
    secondary: {
      base: "hsl(262 83% 58%)",
      glow: "hsl(262 90% 66%)",
      foreground: "hsl(0 0% 100%)",
    },
    accent: {
      base: "hsl(48 96% 53%)",
      glow: "hsl(48 96% 60%)",
      foreground: "hsl(222 47% 11%)",
    },
    surface: {
      base: "hsl(220 14% 96%)",
      secondary: "hsl(220 16% 94%)",
      accent: "hsl(223 18% 90%)",
    },
    background: {
      base: "hsl(220 14% 96%)",
      secondary: "hsl(220 16% 92%)",
    },
    text: {
      primary: "hsl(222 47% 11%)",
      secondary: "hsl(215 16% 35%)",
      muted: "hsl(215 12% 55%)",
    },
  },

  // Dark Mode Colors
  darkColors: {
    primary: {
      base: "hsl(221 83% 62%)",
      glow: "hsl(221 87% 70%)",
    },
    secondary: {
      base: "hsl(262 83% 62%)",
      glow: "hsl(262 88% 70%)",
    },
    accent: {
      base: "hsl(48 96% 60%)",
      glow: "hsl(48 96% 68%)",
    },
    background: {
      base: "hsl(222 47% 11%)",
      card: "hsl(222 43% 16%)",
    },
    text: {
      primary: "hsl(220 33% 94%)",
      secondary: "hsl(220 20% 72%)",
    },
  },

  // Border Radius
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    "2xl": "2rem",
    full: "9999px",
  },

  // Shadows & Effects
  shadows: {
    soft: "0 2px 12px -4px rgba(0, 0, 0, 0.1)",
    elegant: "0 10px 40px -10px hsl(221 83% 53% / 0.25)",
    glow: "0 0 50px hsl(221 90% 60% / 0.4)",
    glass: "0 8px 32px rgba(31, 38, 135, 0.37)",
    neon: "0 0 20px rgba(69, 243, 255, 0.4)",
  },

  // Spacing Scale
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  // Typography
  typography: {
    fonts: {
      arabic: "'Noto Kufi Arabic', 'Tajawal', 'Cairo', sans-serif",
      english: "'Inter', 'DM Sans', 'Poppins', sans-serif",
      mono: "'Fira Code', 'JetBrains Mono', monospace",
    },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // Transitions & Animations
  motion: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      ease: "ease-in-out",
    },
  },

  // Z-Index Hierarchy
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    toast: 1400,
    tooltip: 1500,
  },
} as const;

export type DesignTokens = typeof designTokens;
