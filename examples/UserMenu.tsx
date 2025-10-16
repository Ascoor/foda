import { User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

export const UserMenu = () => {
  const { t } = useTranslation();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full bg-gradient-to-br from-primary to-accent"
        style={{ boxShadow: 'var(--shadow-soft)' }}
        aria-label="User menu"
      >
        <div className="w-9 h-9 rounded-full bg-card flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute top-full mt-2 right-0 w-56 rounded-2xl bg-card/95 backdrop-blur-lg border border-border/50 overflow-hidden z-50"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
          >
            <button
              className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{t('viewProfile')}</span>
            </button>
            <button
              className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">{t('accountSettings')}</span>
            </button>
            <div className="border-t border-border/50" />
            <button
              className="w-full px-4 py-3 text-left hover:bg-destructive/10 transition-colors flex items-center gap-3 text-destructive"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">{t('signOut')}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
