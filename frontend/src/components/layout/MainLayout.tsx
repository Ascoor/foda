import { type CSSProperties, type ReactNode, useMemo, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLanguage } from '@/contexts/LanguageContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { direction } = useLanguage();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const layoutVariables = useMemo(() => ({
    '--layout-header-height': '4rem',
    '--layout-footer-height': '3.5rem',
  }) as CSSProperties, []);

  return (
    <div
      dir={direction}
      className="min-h-screen w-full flex flex-col bg-gradient-to-br from-background via-background/90 to-secondary/10 text-foreground"
      style={layoutVariables}
    >
      {/* ===== Header ثابت ===== */}
      <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

      {/* ===== المحتوى بعد الهيدر ===== */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Sidebar */}
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Main content */}
        <main
          className="flex flex-1 flex-col gap-4 overflow-auto custom-scrollbar p-4 md:p-6"
          style={{
            width: 'min(100%, calc(100vw - var(--sidebar-width, 16rem)))',
            minHeight: 'calc(100vh - var(--layout-header-height, 4rem))',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="flex-1 space-y-4">{children}</div>
          <div className="mt-auto pt-4">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};
