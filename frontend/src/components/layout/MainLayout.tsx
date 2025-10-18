import type { CSSProperties, ReactNode } from 'react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header'; 
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils';

const DESKTOP_BREAKPOINT = 1024;

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { direction } = useLanguage();
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLElement | null>(null);

  // ✅ الحالات (states)
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ✅ تحديد وضع الموبايل أو الديسكتوب
  const isMobile = width < DESKTOP_BREAKPOINT;
  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 272;

  const hideFooterRoutes = useMemo(() => ['/dashboard'], []);
  const shouldRenderFooter = useMemo(
    () => !hideFooterRoutes.some((route) => location.pathname.startsWith(route)),
    [hideFooterRoutes, location.pathname],
  );

  useEffect(() => {
    if (!contentRef.current) return;

    contentRef.current.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [location.pathname, shouldReduceMotion]);

  const pageKey = `${location.pathname}${location.search}`;
  const isRTL = direction === 'rtl';
  const horizontalOffset = useMemo(() => {
    if (isMobile) return 0;
    return isRTL ? -32 : 32;
  }, [isMobile, isRTL]);

  const verticalOffset = useMemo(() => (isMobile ? 24 : 12), [isMobile]);

  const contentMinHeight = useMemo(
    () => `calc(100vh - var(--layout-header-height) - var(--layout-footer-height))`,
    [],
  );
 
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
    const baseStyle: CSSProperties = {
      paddingInlineStart: paddingValue,
      transition: 'padding-inline-start 0.3s ease',
    };

    if (direction === 'rtl') {
      baseStyle.paddingRight = paddingValue;
    } else {
      baseStyle.paddingLeft = paddingValue;
    }

    return baseStyle;
  }, [direction, sidebarWidth]);

  const layoutVariables = useMemo(
    () => ({
      '--sidebar-width': `${sidebarWidth}px`,
      '--layout-header-height': '4.25rem', // خصائص CSS مخصصة
      '--layout-footer-height': shouldRenderFooter ? '3.5rem' : '0rem', // خصائص CSS مخصصة
    } as CSSProperties),
    [shouldRenderFooter, sidebarWidth],
  );

  return (
    <div
      dir={direction}
      className={cn(
        'relative min-h-screen w-full transition-colors duration-500',
        'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]'
      )}
      style={{
        ...layoutVariables, // إضافة المتغيرات المخصصة هنا
      }}
      data-theme={theme}
    >
      {/* ✅ الشريط الجانبي */}

      {/* ✅ الهيكل الرئيسي */}
      <div className="flex min-h-screen flex-col" style={paddingStyle}>
        <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />
        <Sidebar
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
          isMobile={isMobile}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        {/* ✅ المحتوى */}
        <main
          ref={contentRef}
          className="relative flex-1 overflow-x-hidden overflow-y-auto scrollbar-stable"
          style={{ minHeight: contentMinHeight }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pageKey}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      x: horizontalOffset,
                      y: isMobile ? 24 : 12,
                      filter: 'blur(10px)',
                    }
              }
              animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      x: horizontalOffset,
                      y: isMobile ? 16 : 8,
                      filter: 'blur(8px)',
                    }
              }
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-full w-full flex-col gap-6 p-4 sm:p-6"
              style={{ minHeight: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ✅ الفوتر */}
      </div>
    </div>
  );
};
