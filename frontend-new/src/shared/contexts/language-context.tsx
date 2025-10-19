import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import i18n from "@/i18n/config";

export type SupportedLanguage = "en" | "ar";

type LanguageContextValue = {
  language: SupportedLanguage;
  direction: "ltr" | "rtl";
  toggleLanguage: () => void;
  setLanguage: (language: SupportedLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return "en";
  }
  const stored = window.localStorage.getItem("campaign-language") as SupportedLanguage | null;
  if (stored) return stored;
  const browserLang = window.navigator.language.startsWith("ar") ? "ar" : "en";
  return browserLang;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  useEffect(() => {
    i18n.changeLanguage(language);
    if (typeof document !== "undefined") {
      const dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      document.documentElement.classList.toggle("rtl", dir === "rtl");
      document.documentElement.classList.toggle("ltr", dir === "ltr");

      document.body.dir = dir;
      document.body.dataset.direction = dir;
      document.body.classList.toggle("rtl", dir === "rtl");
      document.body.classList.toggle("ltr", dir === "ltr");
      document.body.style.fontFamily = dir === "rtl"
        ? "var(--font-family-rtl)"
        : "var(--font-family-base)";
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("campaign-language", language);
    }
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      direction: language === "ar" ? "rtl" : "ltr",
      toggleLanguage: () =>
        setLanguageState((prev) => (prev === "ar" ? "en" : "ar")),
      setLanguage: setLanguageState,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }
  return context;
};
