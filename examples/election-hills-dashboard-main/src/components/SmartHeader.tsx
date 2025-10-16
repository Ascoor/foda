import { Search, Vote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { NotificationsMenu } from './NotificationsMenu';
import { UserMenu } from './UserMenu';

export const SmartHeader = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0, scale: 0.95 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        scale: 1,
        height: isExpanded ? 88 : 68 
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl z-50 px-7 rounded-[32px] border border-border/30"
      style={{ 
        background: 'linear-gradient(135deg, hsl(var(--card) / 0.75), hsl(var(--card) / 0.65))',
        backdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: 'var(--shadow-neomorph-raised), 0 8px 32px hsla(var(--primary) / 0.08)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)'
      }}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Bottom glow */}
      <div className="absolute -bottom-1 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm" />
      
      <div className="h-full flex items-center justify-between gap-5 relative z-10">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          animate={{ scale: isExpanded ? 1.06 : 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.div 
            className="p-2.5 rounded-[22px] relative"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.2))',
              boxShadow: 'inset 2px 2px 6px hsla(255, 255%, 255%, 0.2), inset -2px -2px 6px hsla(0, 0%, 0%, 0.1)'
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Vote className="w-6 h-6 text-primary drop-shadow-md" />
          </motion.div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-sm">
            {t('dashboard')}
          </h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="relative flex-1 max-w-md"
          animate={{ 
            width: isExpanded ? '100%' : '220px',
            opacity: isExpanded ? 1 : 0.75
          }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('search')}
            className="w-full pl-11 pr-4 py-2.5 rounded-[20px] bg-background/60 border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all backdrop-blur-sm text-sm font-medium"
            style={{ boxShadow: 'inset 2px 2px 4px hsla(0, 0%, 0%, 0.05)' }}
          />
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />
          <NotificationsMenu />
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
};
