import { type ReactNode, useEffect, useMemo, useState } from 'react';
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

  // ✅ الحالات (states)
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ✅ تحديد وضع الموبايل أو الديسكتوب
  const isMobile = width < DESKTOP_BREAKPOINT;
  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 272;

  // ✅ التبديل التلقائي عند تغير حجم الشاشة
  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
      return;
    }
    // تعطيل الطي في الموبايل
    setCollapsed(false);
  }, [isMobile]);

  // ✅ محاذاة padding للغة RTL / LTR
  const paddingStyle = useMemo(() => {
    const paddingValue = `${sidebarWidth}px`;
    return direction === 'rtl'
      ? { paddingRight: paddingValue }
      : { paddingLeft: paddingValue };
  }, [direction, sidebarWidth]);

  return (
    <div
      dir={direction}
      className={cn(
        'relative min-h-screen w-full transition-colors duration-500',
        theme === 'dark'
          ? 'dark bg-[#0b1a2a] text-slate-100'
          : 'bg-slate-50 text-slate-900'
      )}
      style={{
        '--layout-header-height': '4.25rem',
        '--layout-footer-height': '3.5rem',
      } as React.CSSProperties}
    >
      {/* ✅ الشريط الجانبي */}
      <Sidebar
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* ✅ الهيكل الرئيسي */}
      <div
        className="flex min-h-screen flex-col"
        style={{
          ...paddingStyle,
          transition: 'padding 0.3s ease',
        }}
      >
        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

        {/* ✅ المحتوى */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 pt-8 sm:px-6 sm:pt-10 lg:px-10">
            {children}
          </div>
        </main>

        {/* ✅ الفوتر */}
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};
