import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'ar';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguageState(newLang);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('language', language);
  }, [language, direction, i18n]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      direction, 
      toggleLanguage, 
      setLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};