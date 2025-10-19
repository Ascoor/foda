import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

type Language = "ar" | "en";
type Direction = "rtl" | "ltr";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "ar";
    }

    const stored = window.localStorage.getItem("language");
    return (stored as Language) || "ar";
  });

  const direction = useMemo<Direction>(
    () => (language === "ar" ? "rtl" : "ltr"),
    [language],
  );

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "ar" ? "en" : "ar"));
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.dir = direction;
    document.documentElement.lang = language;

    const body = document.body;
    if (!body) {
      return;
    }

    body.dataset.direction = direction;
    body.classList.toggle("is-rtl", direction === "rtl");
    body.classList.toggle("is-ltr", direction === "ltr");
  }, [direction, language]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("language", language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      direction,
      toggleLanguage,
      setLanguage,
      t,
    }),
    [direction, language, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
