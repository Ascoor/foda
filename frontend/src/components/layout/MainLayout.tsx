import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { direction } = useLanguage();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={`min-h-screen w-full ${direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={direction}>
      <Header onSidebarToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            direction === 'rtl'
              ? isSidebarOpen
                ? 'lg:mr-64'
                : 'lg:mr-0'
              : isSidebarOpen
              ? 'lg:ml-64'
              : 'lg:ml-0'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};