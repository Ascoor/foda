import {
  type ReactNode,
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header'; 
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
  const paddingStyle = useMemo(
    () => {
      const paddingValue = `${sidebarWidth}px`;
      return {
        paddingInlineStart: paddingValue,
        transition: 'padding-inline-start 0.3s ease',
        ...(direction === 'rtl'
          ? { paddingRight: paddingValue }
          : { paddingLeft: paddingValue }),
      } satisfies CSSProperties;
    },
    [direction, sidebarWidth],
  );

  const layoutVariables = useMemo(
    () =>
      ({
        '--sidebar-width': `${sidebarWidth}px`,
      }) satisfies CSSProperties,
    [sidebarWidth],
  );

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
        ...layoutVariables,
      }}
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
          className="relative  overflow-y-auto scrollbar-stable"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pageKey}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      x: isMobile ? 0 : isRTL ? 28 : -28,
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
                      x: isMobile ? 0 : isRTL ? -20 : 20,
                      y: isMobile ? 16 : 8,
                      filter: 'blur(8px)',
                    }
              }
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-full flex-col gap-6 p-4 sm:p-6"
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
