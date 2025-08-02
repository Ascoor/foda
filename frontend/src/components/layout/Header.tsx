import React from 'react';
import { Bell, Sun, Moon, Search, User, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, direction, t } = useLanguage();

  const handleLanguageSwitch = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="glass-header h-16 flex items-center justify-between px-6 sticky top-0 z-50 transition-smooth">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="lg:hidden transition-glow hover:neon-glow-blue"
        >
          <Menu className={`h-5 w-5 ${direction === 'rtl' ? 'rtl-flip' : ''}`} />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm transition-all duration-300 hover:scale-110 hover:rotate-3 animate-pulse-glow group">
            <span className="text-sm font-bold transition-transform group-hover:scale-110">ف</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-20 blur-sm group-hover:opacity-40 transition-opacity"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className={`text-lg font-bold text-foreground transition-colors hover:text-primary ${language === 'ar' ? 'font-arabic-heading' : ''}`}>
              {t('app.title')}
            </h1>
            <p className={`text-xs text-muted-foreground ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t('app.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${
            direction === 'rtl' ? 'right-3' : 'left-3'
          }`} />
          <Input
            placeholder={t('common.search')}
            className={`glass ${direction === 'rtl' ? 'pr-9' : 'pl-9'} transition-glow focus:neon-glow-blue`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLanguageSwitch}
          className="transition-glow hover:neon-glow-orange"
        >
          <span className={`text-sm font-medium ${language === 'ar' ? 'font-arabic' : ''}`}>
            {language === 'ar' ? 'EN' : 'ع'}
          </span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="transition-glow hover:neon-glow-blue"
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="transition-glow hover:neon-glow-orange"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0 transition-glow hover:neon-glow-blue">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {language === 'ar' ? 'م' : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className={`glass w-56 ${direction === 'rtl' ? 'mr-4' : 'ml-4'}`} 
            align={direction === 'rtl' ? 'start' : 'end'}
          >
            <DropdownMenuLabel className={language === 'ar' ? 'font-arabic' : ''}>
              {t('nav.profile')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={`${language === 'ar' ? 'font-arabic' : ''} transition-glow hover:neon-glow-blue`}>
              <User className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('nav.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem className={`${language === 'ar' ? 'font-arabic' : ''} transition-glow hover:neon-glow-orange`}>
              <Settings className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('nav.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={`${language === 'ar' ? 'font-arabic' : ''} transition-glow hover:bg-destructive hover:text-destructive-foreground`}>
              <LogOut className={`h-4 w-4 ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('nav.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};