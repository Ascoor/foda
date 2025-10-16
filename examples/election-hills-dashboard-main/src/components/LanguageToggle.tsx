import { Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-colors"
        style={{ boxShadow: 'var(--shadow-soft)' }}
        aria-label="Change language"
      >
        <Languages className="w-5 h-5 text-primary" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-full mt-2 right-0 w-32 rounded-2xl bg-card/95 backdrop-blur-lg border border-border/50 overflow-hidden z-50"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
          >
            <button
              onClick={() => changeLanguage('en')}
              className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors text-sm font-medium"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('ar')}
              className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors text-sm font-medium"
            >
              العربية
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
