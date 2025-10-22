import type { Config } from "tailwindcss";

const withOpacity = (variable: string) =>
  ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue !== undefined) {
      return `hsl(var(${variable}) / ${opacityValue})`;
    }
    return `hsl(var(${variable}))`;
  };

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./App.tsx",
    "./main.tsx",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./layouts/**/*.{ts,tsx,js,jsx}",
    "./utils/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: withOpacity("--background"),
        foreground: withOpacity("--foreground"),
        surface: {
          DEFAULT: withOpacity("--surface"),
          foreground: withOpacity("--surface-foreground"),
          secondary: withOpacity("--surface-secondary"),
          "secondary-foreground": withOpacity("--surface-secondary-foreground"),
        },
        primary: {
          DEFAULT: withOpacity("--primary"),
          foreground: withOpacity("--primary-foreground"),
        },
        secondary: {
          DEFAULT: withOpacity("--secondary"),
          foreground: withOpacity("--secondary-foreground"),
        },
        accent: {
          DEFAULT: withOpacity("--accent"),
          foreground: withOpacity("--accent-foreground"),
        },
        muted: {
          DEFAULT: withOpacity("--muted"),
          foreground: withOpacity("--muted-foreground"),
        },
        border: withOpacity("--border"),
        ring: withOpacity("--ring"),
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-family-base)", "system-ui", "sans-serif"],
        display: ["var(--font-family-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        glass: "var(--shadow-md)",
        elevation: "var(--shadow-lg)",
      },
      backgroundImage: {
        "brand-radial": "radial-gradient(120% 120% at 14% -12%, hsla(var(--primary) / 0.18) 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
