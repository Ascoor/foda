import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Bell, Globe, User, Menu, Vote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/use-window-size';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isRTL = direction === 'rtl';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      dir={direction}
      className="glass-card sticky top-0 z-50 flex h-16 items-center justify-between px-4 md:px-6 border-x-0 border-t-0 w-full"
    >
      {/* Left Section */}
      <div className={cn('flex items-center gap-3 flex-1', isRTL && 'flex-row-reverse')}>
        {isMobile && (
          <Button variant="ghost" size="icon" className="glass-button" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {/* Logo for mobile */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow pulse-glow">
              <Vote className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm neon-text" style={{ color: 'hsl(var(--primary))' }}>
              {t('app.name', { defaultValue: language === 'ar' ? 'فودا' : 'Foda' })}
            </span>
          </motion.div>
        )}

        <div className="relative w-full max-w-md hidden sm:block">
          <Input
            placeholder="Search..."
            className={cn(
              'glass pl-9 border-0 focus-visible:ring-0',
              isRTL && 'text-right pr-9 pl-0'
            )}
          />
          <Bell
            className={cn(
              'absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground',
              isRTL ? 'right-3' : 'left-3'
            )}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
        <Button variant="ghost" size="icon" className="glass-button" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="icon" className="glass-button" onClick={toggleLanguage}>
          <Globe className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="glass-button relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="glass-button">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="glass-card border-white/20">
            <DropdownMenuItem>{user?.name ?? 'Profile'}</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};
