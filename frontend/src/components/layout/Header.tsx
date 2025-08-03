import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe, User, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-none border-x-0 border-t-0 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${direction === 'rtl' ? 'right-3' : 'left-3'}`} />
            <Input
              placeholder={t('common.search')}
              className={`glass border-0 ${direction === 'rtl' ? 'pr-10' : 'pl-10'}`}
            />
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="glass-button"
          >
            <Globe className="h-4 w-4" />
            <span className="ml-2 font-medium">
              {language === 'ar' ? 'العربية' : 'English'}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="glass-button"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="glass-button relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="glass-button">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/20">
              <DropdownMenuItem>
                {t('settings.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('settings.title')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => {
                  logout();
                  navigate('/login');
                }}
              >
                {t('auth.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};