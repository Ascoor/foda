import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Bell, Globe, User, Menu, Vote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/70 backdrop-blur-xl"
    >
      <div className="page-shell flex h-[var(--layout-header-height)] items-center justify-between gap-4">
        {/* Left Section */}
        <div className={cn('flex flex-1 items-center gap-3', isRTL && 'flex-row-reverse')}>
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow pulse-glow">
                <Vote className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-bold neon-text" style={{ color: 'hsl(var(--primary))' }}>
                {t('app.name', { defaultValue: language === 'ar' ? 'فودا' : 'Foda' })}
              </span>
            </motion.div>
          )}

          <div className="relative hidden w-full max-w-md sm:block">
            <Input
              placeholder={t('common.search', { defaultValue: 'Search…' })}
              className={cn(
                'glass h-11 border-0 pl-11 text-sm focus-visible:ring-0',
                isRTL && 'text-right pr-11 pl-0'
              )}
            />
            <Bell
              className={cn(
                'pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground',
                isRTL ? 'right-3.5' : 'left-3.5'
              )}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
          <Button variant="ghost" size="icon" className="glass-button" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon" className="glass-button" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="glass-button relative"
            aria-label={t('notifications.title', { defaultValue: 'Notifications' })}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="glass-button">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="glass-card border-white/20">
              <DropdownMenuItem>{user?.name ?? 'Profile'}</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};
