import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWindowSize } from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

const DESKTOP_BREAKPOINT = 1024;

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { direction } = useLanguage();
  const { theme } = useTheme();
  const { width } = useWindowSize();

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isMobile = width < DESKTOP_BREAKPOINT;
  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 272;

  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
      return;
    }
    setCollapsed(false);
  }, [isMobile]);

  const paddingStyle = useMemo(() => {
    const paddingValue = `${sidebarWidth}px`;
    return direction === 'rtl'
      ? { paddingRight: paddingValue }
      : { paddingLeft: paddingValue };
  }, [direction, sidebarWidth]);

  return (
    <motion.div
      dir={direction}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
      className={cn(
        'relative min-h-screen w-full overflow-hidden transition-colors duration-700 ease-in-out',
        theme === 'dark'
          ? 'bg-[#0b1a2a] text-slate-100'
          : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900'
      )}
      style={{
        '--layout-header-height': '4.25rem',
        '--layout-footer-height': '3.5rem',
      } as React.CSSProperties}
    >
      {/* 💫 الشريط الجانبي (ثابت ومتحرك بانسيابية) */}
      <Sidebar
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* 🌈 الطبقة الأمامية المتحركة (المحتوى + الهيدر + الفوتر) */}
      <motion.div
        className="flex min-h-screen flex-col relative z-10"
        animate={{
          paddingLeft: direction === 'ltr' ? sidebarWidth : 0,
          paddingRight: direction === 'rtl' ? sidebarWidth : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 20,
        }}
        style={{
          transition: 'padding 0.3s ease',
        }}
      >
        {/* 🔹 رأس الصفحة */}
        <motion.div
          layout
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-50"
        >
          <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />
        </motion.div>

        {/* 📜 المحتوى */}
        <motion.main
          layout
          className="flex-1 overflow-y-auto relative z-0"
          transition={{ duration: 0.4 }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 pt-8 sm:px-6 sm:pt-10 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.main>

        {/* 🧱 الفوتر */}
        <motion.div
          layout
          transition={{ duration: 0.4 }}
          className="relative z-10 mt-auto border-t border-white/10 backdrop-blur-sm"
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-10">
            <Footer />
          </div>
        </motion.div>
      </motion.div>

      {/* 🩵 تأثير تلاحم بصري بين الطبقات */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.03] to-transparent dark:via-[#E7B10A]/[0.05] transition-all duration-700" />
    </motion.div>
  );
};
  