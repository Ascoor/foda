import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SmartSidebar } from './SmartSidebar';
import { ProfessionalNavbar } from './ProfessionalNavbar';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfessionalLayoutProps {
  children: ReactNode;
}

export const ProfessionalLayout = ({ children }: ProfessionalLayoutProps) => {
  const { direction } = useLanguage();

  return (
    <div className={`min-h-screen flex w-full ${direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={direction}>
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-background to-surface-secondary" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float opacity-60" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-float opacity-50" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float opacity-40" style={{ animationDelay: '4s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Sidebar */}
      <SmartSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <ProfessionalNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};