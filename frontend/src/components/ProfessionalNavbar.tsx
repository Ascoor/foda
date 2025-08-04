import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  Search,
  Settings,
  User,
  Moon,
  Sun,
  Globe,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export const ProfessionalNavbar = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, direction } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: t('notifications.new_user'),
      message: t('notifications.user_registered'),
      time: '2 min ago',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: t('notifications.system_update'),
      message: t('notifications.update_available'),
      time: '1 hour ago',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: t('notifications.backup_complete'),
      message: t('notifications.backup_success'),
      time: '3 hours ago',
      read: true,
      type: 'success'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      case 'success': return 'text-success';
      default: return 'text-primary';
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-none border-x-0 border-t-0 h-16 px-6 flex items-center justify-between z-30"
    >
      {/* Left Section - Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('navbar.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-button border-white/20 bg-white/10 focus:bg-white/20"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="glass"
          size="icon"
          onClick={toggleTheme}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Language Toggle */}
        <Button
          variant="glass"
          size="icon"
          onClick={toggleLanguage}
          className="relative"
        >
          <Globe className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 text-xs font-bold bg-secondary text-white rounded-full w-4 h-4 flex items-center justify-center">
            {language === 'ar' ? 'ع' : 'EN'}
          </span>
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={cn(
                  "absolute top-12 w-80 glass-card shadow-xl z-50 max-h-96 overflow-y-auto custom-scrollbar",
                  direction === 'rtl' ? 'left-0' : 'right-0'
                )}
              >
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold">{t('navbar.notifications')}</h3>
                </div>
                <div className="p-2">
                  {notifications.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      {t('navbar.no_notifications')}
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "p-3 rounded-lg mb-2 cursor-pointer transition-colors",
                          notification.read ? 'bg-white/5' : 'bg-primary/10'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("w-2 h-2 rounded-full mt-2", getNotificationColor(notification.type))} />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <Button
            variant="glass"
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" alt="Profile" />
              <AvatarFallback className="bg-gradient-primary text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={cn(
                  "absolute top-12 w-56 glass-card shadow-xl z-50",
                  direction === 'rtl' ? 'left-0' : 'right-0'
                )}
              >
                <div className="p-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    {t('navbar.profile')}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    {t('navbar.settings')}
                  </Button>
                  <div className="border-t border-white/10 my-2" />
                  <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('navbar.logout')}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </motion.header>
  );
};