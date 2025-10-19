import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { getThemeCssVariables, type ThemeMode } from "@shared/lib/theme-tokens";

type ThemePreference = ThemeMode | "system";

type ThemeContextValue = {
  theme: ThemeMode;
  preference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (mode: ThemePreference) => void;
};

const STORAGE_KEY = "foda-theme-preference";

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  preference: "system",
  toggleTheme: () => undefined,
  setTheme: () => undefined,
});

const getSystemTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialPreference = (): ThemePreference => {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [preference, setPreference] = useState<ThemePreference>(() => getInitialPreference());
  const [systemTheme, setSystemTheme] = useState<ThemeMode>(() => getSystemTheme());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstRender = useRef(true);

  const theme: ThemeMode = preference === "system" ? systemTheme : preference;

  const applyTheme = useCallback((mode: ThemeMode) => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    root.dataset.theme = mode;
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode === "light");
    root.style.colorScheme = mode;

    const variables = getThemeCssVariables(mode);
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    body.dataset.theme = mode;
    body.classList.toggle("dark", mode === "dark");
    body.classList.toggle("light", mode === "light");
  }, []);

  useEffect(() => {
    applyTheme(theme);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsTransitioning(true);
  }, [applyTheme, theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (preference === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, preference);
    }
  }, [preference]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;
    if (typeof window === "undefined") return;

    const timeout = window.setTimeout(() => setIsTransitioning(false), 450);
    return () => window.clearTimeout(timeout);
  }, [isTransitioning]);

  const setTheme = useCallback((mode: ThemePreference) => {
    setPreference(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreference((prev) => {
      const current = prev === "system" ? theme : prev;
      return current === "dark" ? "light" : "dark";
    });
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      toggleTheme,
      setTheme,
    }),
    [theme, preference, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence mode="wait">
              {isTransitioning ? (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pointer-events-none fixed inset-0 z-[9999]"
                  style={{
                    background:
                      "radial-gradient(120% 140% at 10% -20%, hsla(var(--primary) / 0.28) 0%, hsla(var(--secondary) / 0.24) 38%, hsla(var(--background) / 0.9) 100%)",
                    backdropFilter: "blur(28px) saturate(180%)",
                  }}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
