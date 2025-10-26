import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import tailwindcssAnimate from "tailwindcss-animate";

// Glass plugin for custom styles
const glassPlugin = plugin(({ addComponents }) => {
  const baseGlass = {
    background: "var(--glass-background)",
    border: "1px solid var(--glass-border)",
    boxShadow: "var(--glass-shadow)",
    backdropFilter: "var(--glass-backdrop)",
    transition: "var(--transition-glass)",
    position: "relative",
  } as const;

  addComponents({
    ".glass": {
      ...baseGlass,
      borderRadius: "var(--radius-xl)",
    },
    ".glass-card": {
      ...baseGlass,
      borderRadius: "var(--radius-2xl)",
      padding: "clamp(var(--spacing-md), 1.25vw + var(--spacing-sm), var(--spacing-xl))",
      "&:hover": {
        transform: "translateY(-2px) scale(1.01)",
        boxShadow: "var(--glass-shadow), var(--hover-glow)",
      },
    },
    ".glass-button": {
      ...baseGlass,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--spacing-xs)",
      minHeight: "2.75rem",
      paddingInline: "clamp(var(--spacing-sm), 2vw, var(--spacing-lg))",
      paddingBlock: "var(--spacing-2xs)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      fontWeight: "500",
      "&::before": {
        content: "''",
        position: "absolute",
        insetBlock: "0",
        insetInlineStart: "-100%",
        width: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)",
        transition: "inset-inline-start 0.5s ease",
      },
      "&:hover::before": {
        insetInlineStart: "100%",
      },
      "&:hover": {
        background: "var(--hover-background)",
        boxShadow: "var(--hover-glow)",
        transform: "translateY(-2px)",
      },
    },
  });
});

// Glassmorphism plugin with custom styles
const glassmorphismPlugin = plugin(({ addComponents }) => {
  const baseGlass = {
    background: "var(--glass-background)",
    border: "1px solid var(--glass-border)",
    boxShadow: "var(--glass-shadow)",
    backdropFilter: "var(--glass-backdrop)",
    transition: "var(--transition-glass)",
    position: "relative",
  };

  addComponents({
    ".glass": {
      ...baseGlass,
      borderRadius: "var(--radius-xl)",
    },
    ".glass-card": {
      ...baseGlass,
      borderRadius: "var(--radius-2xl)",
      padding: "clamp(var(--spacing-md), 1.25vw + var(--spacing-sm), var(--spacing-xl))",
      "&:hover": {
        transform: "translateY(-2px) scale(1.01)",
        boxShadow: "var(--glass-shadow), var(--hover-glow)",
      },
    },
    ".glass-button": {
      ...baseGlass,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--spacing-xs)",
      minHeight: "2.75rem",
      paddingInline: "clamp(var(--spacing-sm), 2vw, var(--spacing-lg))",
      paddingBlock: "var(--spacing-2xs)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      fontWeight: "500",
      "&::before": {
        content: "''",
        position: "absolute",
        insetBlock: "0",
        insetInlineStart: "-100%",
        width: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)",
        transition: "inset-inline-start 0.5s ease",
      },
      "&:hover::before": {
        insetInlineStart: "100%",
      },
      "&:hover": {
        background: "var(--hover-background)",
        boxShadow: "var(--hover-glow)",
        transform: "translateY(-2px)",
      },
    },
  });
});

// Tailwind CSS configuration
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: {
          DEFAULT: 'hsl(var(--background))',
          secondary: 'hsl(var(--background-secondary))'
        },
        foreground: 'hsl(var(--foreground))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          secondary: 'hsl(var(--surface-secondary))',
          accent: 'hsl(var(--surface-accent))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          glow: 'hsl(var(--primary-glow))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          glow: 'hsl(var(--secondary-glow))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          glow: 'hsl(var(--accent-glow))'
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          glass: 'hsl(var(--card-glass))'
        }
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-glass': 'var(--gradient-glass)',
        'gradient-glow': 'var(--gradient-glow)'
      },
      boxShadow: {
        'elegant': 'var(--shadow-elegant)',
        'glow': 'var(--shadow-glow)',
        'glass': 'var(--shadow-glass)'
      },
      backdropBlur: {
        'glass': 'var(--glass-backdrop)'
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'system-ui', 'sans-serif'],
        'dm-sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'cairo': ['Cairo', 'system-ui', 'sans-serif'],
        'tajawal': ['Tajawal', 'system-ui', 'sans-serif'],
        'noto-kufi': ['Noto Kufi Arabic', 'system-ui', 'sans-serif'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slide-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'counter': 'counter 2s ease-out'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.98)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, glassmorphismPlugin],
};

export default config;
