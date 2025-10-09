import { ReactNode, useMemo, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { useLanguage } from '@/contexts/LanguageContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';
  const paddingStyle = useMemo(() => {
    const property = isRTL ? 'paddingInlineEnd' : 'paddingInlineStart';
    return {
      [property]: 'var(--sidebar-width, 16rem)',
      transition: 'padding-inline-start 0.3s ease, padding-inline-end 0.3s ease'
    } as CSSProperties;
  }, [isRTL]);

  return (
    <div className={`min-h-screen w-full ${isRTL ? 'rtl' : 'ltr'}`} dir={direction}>
      <div
        className={`min-h-screen flex w-full ${isRTL ? 'justify-end' : 'justify-start'}`}
        style={paddingStyle}
      >
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          <NotificationDrawer />

          {/* Page Content */}
          <main className="flex-1 overflow-auto custom-scrollbar">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};
