/**
 * Foda Design System - Theme Configuration
 * Professional design tokens for RTL/LTR bilingual dashboard
 */

export const designTokens = {
  // Brand Colors (HSL format for theming)
  colors: {
    primary: {
      base: "hsl(220 90% 56%)",
      glow: "hsl(220 85% 65%)",
      foreground: "hsl(0 0% 100%)",
    },
    secondary: {
      base: "hsl(15 95% 55%)",
      glow: "hsl(15 85% 70%)",
      foreground: "hsl(0 0% 100%)",
    },
    accent: {
      base: "hsl(280 75% 60%)",
      glow: "hsl(280 65% 75%)",
      foreground: "hsl(0 0% 100%)",
    },
    surface: {
      base: "hsl(0 0% 100%)",
      secondary: "hsl(210 20% 95%)",
      accent: "hsl(210 30% 92%)",
    },
    background: {
      base: "hsl(220 15% 97%)",
      secondary: "hsl(220 20% 95%)",
    },
    text: {
      primary: "hsl(220 15% 15%)",
      secondary: "hsl(220 10% 45%)",
      muted: "hsl(220 10% 65%)",
    },
  },

  // Dark Mode Colors
  darkColors: {
    primary: {
      base: "hsl(217 91% 60%)",
      glow: "hsl(217 91% 70%)",
    },
    secondary: {
      base: "hsl(262 83% 58%)",
      glow: "hsl(262 83% 68%)",
    },
    accent: {
      base: "hsl(30 100% 60%)",
      glow: "hsl(30 100% 70%)",
    },
    background: {
      base: "hsl(222 47% 6%)",
      card: "hsl(221 39% 11%)",
    },
    text: {
      primary: "hsl(210 40% 95%)",
      secondary: "hsl(215 20.2% 65.1%)",
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
    elegant: "0 10px 40px -10px hsl(220 90% 56% / 0.25)",
    glow: "0 0 50px hsl(220 85% 65% / 0.4)",
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
