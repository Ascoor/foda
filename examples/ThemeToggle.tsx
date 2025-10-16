import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      className="relative p-3 rounded-[20px] border border-border/40"
      style={{ 
        background: 'linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.6))',
        boxShadow: 'var(--shadow-neomorph-raised)',
        backdropFilter: 'blur(12px)'
      }}
      aria-label="Toggle theme"
    >
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{ boxShadow: 'inset 1px 1px 3px hsla(0, 0%, 100%, 0.2), inset -1px -1px 3px hsla(0, 0%, 0%, 0.1)' }}
      />
      
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        className="relative z-10"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-primary drop-shadow-md" />
        ) : (
          <Sun className="w-5 h-5 text-accent drop-shadow-md" />
        )}
      </motion.div>
      
      {/* Ambient glow on dark mode */}
      {theme === 'dark' && (
        <div 
          className="absolute inset-0 rounded-[20px] pointer-events-none opacity-50"
          style={{ boxShadow: '0 0 20px hsla(var(--accent) / 0.3)' }}
        />
      )}
    </motion.button>
  );
};
