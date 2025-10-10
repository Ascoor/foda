import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLanguage } from '@/contexts/LanguageContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { direction } = useLanguage();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      dir={direction}
      className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/90 to-secondary/10 text-foreground"
    >
      {/* ===== Header ثابت ===== */}
      <Header onToggleSidebar={() => setMobileSidebarOpen(true)} />

      {/* ===== المحتوى بعد الهيدر ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto custom-scrollbar p-6 mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};
