export type ThemeMode = "light" | "dark";

const BRAND_COLORS = {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  accent: "#F97316",
} as const;

const NEUTRAL_COLORS = {
  lightBackground: "#F4F6FB",
  darkBackground: "#050B1A",
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
  header: {
    glassFrom: string;
    glassTo: string;
    border: string;
    glow: string;
    sheen: string;
    title: {
      from: string;
      via: string;
      to: string;
    };
    widgetBackground: string;
    widgetBorder: string;
    widgetShadow: string;
    widgetForeground: string;
    avatarGradient: string;
    avatarShadow: string;
  };
  sidebar: {
    glassFrom: string;
    glassTo: string;
    border: string;
    glow: string;
    accent: string;
  };
  navigation: {
    rowBackground: string;
    rowBorder: string;
    rowBorderActive: string;
    rowShadow: string;
    activeBackground: string;
    activeGlow: string;
    text: string;
    textMuted: string;
    iconBackground: string;
    iconForeground: string;
    iconForegroundMuted: string;
    iconRing: string;
    iconRingActive: string;
    iconShadow: string;
    iconShadowActive: string;
    iconHighlight: string;
    tooltipBackground: string;
    tooltipForeground: string;
    badgeBackground: string;
    badgeForeground: string;
  };
  themeToggle: {
    sun: string;
    moon: string;
  };
  shell: {
    outer: [string, string];
    inner: [string, string];
  };
};

export const themeTokens: Record<ThemeMode, ThemeDefinition> = {
  light: {
    background: NEUTRAL_COLORS.lightBackground,
    foreground: NEUTRAL_COLORS.lightForeground,
    surface: "#FFFFFF",
    surfaceSecondary: "#E2E8FF",
    muted: "#64748B",
    mutedForeground: "#475569",
    border: "#CBD5F5",
    ring: BRAND_COLORS.primary,
    overlayFrom: "#60A5FA33",
    overlayTo: "#8B5CF629",
    shadow: {
      sm: "0 18px 38px -24px rgba(59, 130, 246, 0.22)",
      md: "0 36px 82px -48px rgba(15, 23, 42, 0.24)",
      lg: "0 54px 128px -60px rgba(59, 130, 246, 0.22)",
    },
    header: {
      glassFrom: "rgba(255, 255, 255, 0.92)",
      glassTo: "rgba(226, 239, 255, 0.78)",
      border: "rgba(148, 163, 184, 0.38)",
      glow: "0 32px 86px -40px rgba(59, 130, 246, 0.35)",
      sheen: "rgba(255, 255, 255, 0.65)",
      title: {
        from: "#0284C7",
        via: "#3B82F6",
        to: "#8B5CF6",
      },
      widgetBackground: "rgba(241, 245, 255, 0.82)",
      widgetBorder: "rgba(148, 163, 184, 0.38)",
      widgetShadow: "0 22px 44px -28px rgba(59, 130, 246, 0.28)",
      widgetForeground: "#1E293B",
      avatarGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.28) 0%, rgba(139, 92, 246, 0.35) 100%)",
      avatarShadow: "0 18px 40px -24px rgba(99, 102, 241, 0.42)",
    },
    sidebar: {
      glassFrom: "rgba(247, 249, 255, 0.92)",
      glassTo: "rgba(224, 239, 255, 0.76)",
      border: "rgba(148, 163, 184, 0.42)",
      glow: "0 36px 92px -44px rgba(59, 130, 246, 0.32)",
      accent: "rgba(226, 232, 255, 0.72)",
    },
    navigation: {
      rowBackground: "rgba(255, 255, 255, 0.56)",
      rowBorder: "rgba(226, 232, 255, 0.32)",
      rowBorderActive: "rgba(59, 130, 246, 0.55)",
      rowShadow: "0 18px 42px -32px rgba(15, 23, 42, 0.25)",
      activeBackground:
        "linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(139, 92, 246, 0.24) 48%, rgba(14, 165, 233, 0.18) 100%)",
      activeGlow: "0 28px 64px -30px rgba(79, 70, 229, 0.45)",
      text: "#1E293B",
      textMuted: "rgba(71, 85, 105, 0.85)",
      iconBackground: "rgba(248, 250, 255, 0.9)",
      iconForeground: "#1E3A8A",
      iconForegroundMuted: "rgba(71, 85, 105, 0.9)",
      iconRing: "rgba(148, 163, 184, 0.45)",
      iconRingActive: "rgba(59, 130, 246, 0.6)",
      iconShadow: "0 16px 38px -26px rgba(30, 64, 175, 0.35)",
      iconShadowActive: "0 20px 42px -24px rgba(59, 130, 246, 0.45)",
      iconHighlight: "rgba(255, 255, 255, 0.75)",
      tooltipBackground: "rgba(15, 23, 42, 0.92)",
      tooltipForeground: "#F8FAFC",
      badgeBackground: "rgba(99, 102, 241, 0.15)",
      badgeForeground: "#4338CA",
    },
    themeToggle: {
      sun: "#F97316",
      moon: "#0EA5E9",
    },
    shell: {
      outer: [
        "radial-gradient(140% 120% at 20% -20%, rgba(59, 130, 246, 0.16) 0%, transparent 65%)",
        "radial-gradient(120% 120% at 90% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
      ],
      inner: [
        "radial-gradient(120% 120% at 10% 0%, rgba(59, 130, 246, 0.14) 0%, transparent 55%)",
        "radial-gradient(120% 120% at 85% 10%, rgba(14, 165, 233, 0.12) 0%, transparent 60%)",
      ],
    },
  },
  dark: {
    background: NEUTRAL_COLORS.darkBackground,
    foreground: NEUTRAL_COLORS.darkForeground,
    surface: "#0F172A",
    surfaceSecondary: "#1E293B",
    muted: "#94A3B8",
    mutedForeground: "#CBD5F5",
    border: "#1F2A44",
    ring: BRAND_COLORS.primary,
    overlayFrom: "#3B82F636",
    overlayTo: "#8B5CF629",
    shadow: {
      sm: "0 18px 32px -24px rgba(7, 12, 24, 0.55)",
      md: "0 36px 72px -42px rgba(7, 12, 24, 0.62)",
      lg: "0 54px 120px -58px rgba(56, 189, 248, 0.38)",
    },
    header: {
      glassFrom: "rgba(10, 18, 38, 0.82)",
      glassTo: "rgba(28, 46, 98, 0.72)",
      border: "rgba(59, 130, 246, 0.38)",
      glow: "0 32px 86px -42px rgba(56, 189, 248, 0.48)",
      sheen: "rgba(148, 163, 255, 0.28)",
      title: {
        from: "#38BDF8",
        via: "#60A5FA",
        to: "#C084FC",
      },
      widgetBackground: "rgba(15, 23, 42, 0.82)",
      widgetBorder: "rgba(59, 130, 246, 0.35)",
      widgetShadow: "0 26px 52px -30px rgba(14, 165, 233, 0.42)",
      widgetForeground: "#E2E8F0",
      avatarGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.45) 0%, rgba(168, 85, 247, 0.48) 100%)",
      avatarShadow: "0 22px 46px -28px rgba(56, 189, 248, 0.5)",
    },
    sidebar: {
      glassFrom: "rgba(8, 14, 30, 0.9)",
      glassTo: "rgba(24, 39, 89, 0.76)",
      border: "rgba(56, 189, 248, 0.28)",
      glow: "0 38px 96px -46px rgba(37, 99, 235, 0.42)",
      accent: "rgba(15, 23, 42, 0.82)",
    },
    navigation: {
      rowBackground: "rgba(9, 15, 28, 0.68)",
      rowBorder: "rgba(30, 41, 59, 0.55)",
      rowBorderActive: "rgba(96, 165, 250, 0.6)",
      rowShadow: "0 18px 42px -30px rgba(2, 6, 23, 0.65)",
      activeBackground:
        "linear-gradient(135deg, rgba(59, 130, 246, 0.32) 0%, rgba(168, 85, 247, 0.36) 48%, rgba(14, 165, 233, 0.3) 100%)",
      activeGlow: "0 32px 70px -32px rgba(14, 165, 233, 0.58)",
      text: "#E2E8F0",
      textMuted: "rgba(148, 163, 184, 0.82)",
      iconBackground: "rgba(15, 23, 42, 0.82)",
      iconForeground: "#60A5FA",
      iconForegroundMuted: "rgba(148, 163, 255, 0.86)",
      iconRing: "rgba(59, 130, 246, 0.38)",
      iconRingActive: "rgba(168, 85, 247, 0.52)",
      iconShadow: "0 20px 40px -28px rgba(8, 25, 56, 0.68)",
      iconShadowActive: "0 26px 52px -26px rgba(56, 189, 248, 0.56)",
      iconHighlight: "rgba(148, 163, 255, 0.35)",
      tooltipBackground: "rgba(15, 23, 42, 0.92)",
      tooltipForeground: "#E2E8F0",
      badgeBackground: "rgba(56, 189, 248, 0.18)",
      badgeForeground: "#38BDF8",
    },
    themeToggle: {
      sun: "#FBBF24",
      moon: "#60A5FA",
    },
    shell: {
      outer: [
        "radial-gradient(140% 140% at 18% -20%, rgba(59, 130, 246, 0.28) 0%, transparent 70%)",
        "radial-gradient(120% 120% at 90% 10%, rgba(168, 85, 247, 0.24) 0%, transparent 65%)",
      ],
      inner: [
        "radial-gradient(120% 120% at 12% 0%, rgba(59, 130, 246, 0.24) 0%, transparent 58%)",
        "radial-gradient(120% 120% at 80% 8%, rgba(14, 165, 233, 0.24) 0%, transparent 60%)",
      ],
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
  const headerTitleFrom = hexToHsl(theme.header.title.from);
  const headerTitleVia = hexToHsl(theme.header.title.via);
  const headerTitleTo = hexToHsl(theme.header.title.to);

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
    "--header-glass-from": theme.header.glassFrom,
    "--header-glass-to": theme.header.glassTo,
    "--header-border": theme.header.border,
    "--header-glow": theme.header.glow,
    "--header-sheen": theme.header.sheen,
    "--header-title-from": headerTitleFrom,
    "--header-title-via": headerTitleVia,
    "--header-title-to": headerTitleTo,
    "--header-widget-background": theme.header.widgetBackground,
    "--header-widget-border": theme.header.widgetBorder,
    "--header-widget-shadow": theme.header.widgetShadow,
    "--header-widget-foreground": theme.header.widgetForeground,
    "--header-avatar-gradient": theme.header.avatarGradient,
    "--header-avatar-shadow": theme.header.avatarShadow,
    "--sidebar-glass-from": theme.sidebar.glassFrom,
    "--sidebar-glass-to": theme.sidebar.glassTo,
    "--sidebar-border": theme.sidebar.border,
    "--sidebar-glow": theme.sidebar.glow,
    "--sidebar-accent": theme.sidebar.accent,
    "--navigation-row-background": theme.navigation.rowBackground,
    "--navigation-row-border": theme.navigation.rowBorder,
    "--navigation-row-border-active": theme.navigation.rowBorderActive,
    "--navigation-row-shadow": theme.navigation.rowShadow,
    "--navigation-active-background": theme.navigation.activeBackground,
    "--navigation-active-glow": theme.navigation.activeGlow,
    "--navigation-text": theme.navigation.text,
    "--navigation-text-muted": theme.navigation.textMuted,
    "--navigation-icon-background": theme.navigation.iconBackground,
    "--navigation-icon-foreground": theme.navigation.iconForeground,
    "--navigation-icon-foreground-muted": theme.navigation.iconForegroundMuted,
    "--navigation-icon-ring": theme.navigation.iconRing,
    "--navigation-icon-ring-active": theme.navigation.iconRingActive,
    "--navigation-icon-shadow": theme.navigation.iconShadow,
    "--navigation-icon-shadow-active": theme.navigation.iconShadowActive,
    "--navigation-icon-highlight": theme.navigation.iconHighlight,
    "--navigation-tooltip-background": theme.navigation.tooltipBackground,
    "--navigation-tooltip-foreground": theme.navigation.tooltipForeground,
    "--navigation-badge-background": theme.navigation.badgeBackground,
    "--navigation-badge-foreground": theme.navigation.badgeForeground,
    "--theme-toggle-sun": theme.themeToggle.sun,
    "--theme-toggle-moon": theme.themeToggle.moon,
    "--shell-outer-gradient-1": theme.shell.outer[0],
    "--shell-outer-gradient-2": theme.shell.outer[1],
    "--shell-inner-gradient-1": theme.shell.inner[0],
    "--shell-inner-gradient-2": theme.shell.inner[1],
  } as Record<string, string>;
};
