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
    '--layout-header-height': 'var(--header-height, 4rem)',
    '--layout-footer-height': 'var(--footer-height, 3.5rem)',
    '--sidebar-width': 'var(--sidebar-width-expanded)',
  }) as CSSProperties, []);

  return (
    <div
      dir={direction}
      className="flex min-h-screen w-full flex-col bg-gradient-to-br from-background via-background/95 to-secondary/10 text-foreground"
      style={layoutVariables}
    >
      {/* ===== Header ثابت ===== */}
      <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

      {/* ===== المحتوى بعد الهيدر ===== */}
      <div className="flex w-full flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Main content */}
        <main
          className="custom-scrollbar flex-1 overflow-auto"
          style={{ minHeight: 'calc(100vh - var(--layout-header-height, 4rem))' }}
        >
          <div className="page-shell layout-content">
            <div className="page-content">{children}</div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};
