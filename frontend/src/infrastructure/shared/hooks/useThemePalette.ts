import { useEffect, useState } from "react";

export type ColorToken = "primary" | "secondary" | "accent" | "success";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface ThemePalette {
  tokens: Record<ColorToken, { base: string; soft: string }>;
  surface: string;
  surfaceSoft: string;
  background: string;
  border: string;
  borderSoft: string;
  foreground: string;
  muted: string;
  mutedSoft: string;
  mutedForeground: string;
  grid: string;
}

const TOKEN_KEYS: ColorToken[] = ["primary", "secondary", "accent", "success"];

const FALLBACK_COLORS: Record<string, RgbColor> = {
  primary: hslToRgbColor(11, 100, 60),
  secondary: hslToRgbColor(131, 100, 60),
  accent: hslToRgbColor(251, 100, 60),
  success: hslToRgbColor(142, 76, 36),
  surface: hslToRgbColor(0, 0, 100),
  background: hslToRgbColor(0, 0, 96),
  border: hslToRgbColor(0, 0, 82),
  muted: hslToRgbColor(0, 0, 90),
  "muted-foreground": hslToRgbColor(0, 0, 45),
  foreground: hslToRgbColor(0, 0, 20),
};

function hslToRgbColor(h: number, s: number, l: number): RgbColor {
  const saturation = Math.max(0, Math.min(100, s)) / 100;
  const lightness = Math.max(0, Math.min(100, l)) / 100;
  const hue = ((h % 360) + 360) % 360;

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness - chroma / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = chroma;
    g = x;
    b = 0;
  } else if (hue < 120) {
    r = x;
    g = chroma;
    b = 0;
  } else if (hue < 180) {
    r = 0;
    g = chroma;
    b = x;
  } else if (hue < 240) {
    r = 0;
    g = x;
    b = chroma;
  } else if (hue < 300) {
    r = x;
    g = 0;
    b = chroma;
  } else {
    r = chroma;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function parseColorValue(raw: string): RgbColor | null {
  const value = raw.trim();
  if (!value) {
    return null;
  }

  if (value.startsWith("#")) {
    return hexToRgb(value);
  }

  if (value.startsWith("rgb")) {
    const components = value.match(/\d+\.?\d*/g);
    if (!components || components.length < 3) {
      return null;
    }
    return {
      r: clamp255(Number.parseFloat(components[0])),
      g: clamp255(Number.parseFloat(components[1])),
      b: clamp255(Number.parseFloat(components[2])),
    };
  }

  if (value.startsWith("hsl")) {
    const components = value.match(/-?\d+\.?\d*/g);
    if (!components || components.length < 3) {
      return null;
    }
    return hslToRgbColor(
      Number.parseFloat(components[0]),
      Number.parseFloat(components[1]),
      Number.parseFloat(components[2]),
    );
  }

  const numeric = value.match(/-?\d+\.?\d*%?/g);
  if (!numeric || numeric.length < 3) {
    return null;
  }

  const hasPercentages = /%/.test(value);
  if (hasPercentages) {
    return hslToRgbColor(
      Number.parseFloat(numeric[0]),
      Number.parseFloat(numeric[1]),
      Number.parseFloat(numeric[2]),
    );
  }

  return {
    r: clamp255(Number.parseFloat(numeric[0])),
    g: clamp255(Number.parseFloat(numeric[1])),
    b: clamp255(Number.parseFloat(numeric[2])),
  };
}

function hexToRgb(hex: string): RgbColor | null {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 3 && normalized.length !== 6) {
    return null;
  }

  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return { r, g, b };
}

function clamp255(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(255, Math.round(value)));
}

function toRgbaString(color: RgbColor, alpha = 1): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.max(0, Math.min(1, alpha))})`;
}

function resolveColor(
  style: CSSStyleDeclaration | null,
  variable: string,
  fallbackKey: keyof typeof FALLBACK_COLORS,
): RgbColor {
  if (!style) {
    return FALLBACK_COLORS[fallbackKey];
  }

  const raw = style.getPropertyValue(`--${variable}`);
  const parsed = parseColorValue(raw);
  return parsed ?? FALLBACK_COLORS[fallbackKey];
}

function createPaletteFromStyle(
  style: CSSStyleDeclaration | null,
): ThemePalette {
  const getColor = (variable: keyof typeof FALLBACK_COLORS) =>
    resolveColor(style, variable, variable);

  const tokenColors = TOKEN_KEYS.reduce<
    Record<ColorToken, { base: string; soft: string }>
  >(
    (acc, token) => {
      const rgb = getColor(token);
      acc[token] = {
        base: toRgbaString(rgb, 1),
        soft: toRgbaString(rgb, 0.25),
      };
      return acc;
    },
    {} as Record<ColorToken, { base: string; soft: string }>,
  );

  const surface = getColor("surface");
  const background = getColor("background");
  const border = getColor("border");
  const muted = getColor("muted");
  const mutedForeground = resolveColor(
    style,
    "muted-foreground",
    "muted-foreground",
  );
  const foreground = getColor("foreground");

  return {
    tokens: tokenColors,
    surface: toRgbaString(surface, 1),
    surfaceSoft: toRgbaString(surface, 0.65),
    background: toRgbaString(background, 1),
    border: toRgbaString(border, 0.5),
    borderSoft: toRgbaString(border, 0.25),
    foreground: toRgbaString(foreground, 0.95),
    muted: toRgbaString(muted, 1),
    mutedSoft: toRgbaString(muted, 0.3),
    mutedForeground: toRgbaString(mutedForeground, 0.9),
    grid: toRgbaString(muted, 0.35),
  };
}

function readPalette(): ThemePalette {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return createPaletteFromStyle(null);
  }

  const computedStyles = getComputedStyle(document.documentElement);
  return createPaletteFromStyle(computedStyles);
}

export function useThemePalette(): ThemePalette {
  const [palette, setPalette] = useState<ThemePalette>(() => readPalette());

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const updatePalette = () => setPalette(readPalette());

    updatePalette();

    const observer = new MutationObserver(updatePalette);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    window.addEventListener("themechange", updatePalette);

    return () => {
      observer.disconnect();
      window.removeEventListener("themechange", updatePalette);
    };
  }, []);

  return palette;
}
