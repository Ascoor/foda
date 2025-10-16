import { Home, MessageSquare, BarChart3, FileText, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const navItems = [
  { icon: Home, key: 'home' },
  { icon: MessageSquare, key: 'messages' },
  { icon: BarChart3, key: 'analytics' },
  { icon: FileText, key: 'reports' },
  { icon: Settings, key: 'settings' },
  { icon: User, key: 'profile' }
];

export const FloatingSidebar = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('home');

  return (
    <motion.aside
      initial={{ x: -120, opacity: 0, scale: 0.9 }}
      animate={{ 
        x: 0, 
        opacity: 1, 
        scale: 1,
        width: isExpanded ? 240 : 72 
      }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed left-4 top-28 bottom-8 z-40 rounded-[32px] border border-border/30 p-5"
      style={{ 
        background: 'linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.7))',
        backdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: 'var(--shadow-neomorph-raised), 0 8px 32px hsla(var(--primary) / 0.08)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)'
      }}
    >
      {/* Carved edge effect */}
      <div 
        className="absolute inset-0 rounded-[32px] pointer-events-none"
        style={{ boxShadow: 'inset 3px 3px 8px hsla(0, 0%, 0%, 0.08), inset -3px -3px 8px hsla(255, 255%, 255%, 0.05)' }}
      />
      
      {/* Side glow for dark mode */}
      <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-0 dark:opacity-100" />
      
      <nav className="h-full flex flex-col gap-3 relative z-10">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.key;
          
          return (
            <motion.button
              key={item.key}
              onClick={() => setActiveItem(item.key)}
              className={`relative flex items-center gap-4 p-3.5 rounded-[22px] transition-all duration-300 ${
                isActive 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--accent) / 0.8))'
                  : 'transparent',
                boxShadow: isActive 
                  ? 'var(--shadow-neomorph-inset), 0 4px 12px hsla(var(--primary) / 0.3)'
                  : 'none'
              }}
              whileHover={{ 
                x: 6, 
                scale: 1.03,
                boxShadow: isActive 
                  ? 'var(--shadow-neomorph-inset), 0 6px 16px hsla(var(--primary) / 0.4)'
                  : '0 4px 12px hsla(var(--foreground) / 0.08)'
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <motion.div
                animate={{ rotate: isActive ? 360 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <Icon className="w-5 h-5 flex-shrink-0 drop-shadow-sm" />
              </motion.div>
              
              <motion.span
                initial={false}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? 'auto' : 0
                }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                className="font-semibold whitespace-nowrap overflow-hidden text-sm"
              >
                {t(item.key)}
              </motion.span>
              
              {/* Active glow indicator */}
              {isActive && (
                <>
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full"
                    style={{ 
                      background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--accent)))',
                      boxShadow: '0 0 12px hsla(var(--primary) / 0.6)'
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                  {isExpanded && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg"
                    />
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
};
