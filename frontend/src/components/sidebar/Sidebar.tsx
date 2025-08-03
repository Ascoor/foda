import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarSection } from './SidebarSection';
import { sidebarSections, SidebarItem } from './sidebarConfig';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { direction, language, t } = useLanguage();
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const navRef = React.useRef<HTMLDivElement>(null);

  const toggleItem = (key: string) => {
    setOpenItems((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const isActiveRoute = (path: string) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isParentActive = (item: SidebarItem) => {
    if (item.path && isActiveRoute(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => isActiveRoute(child.path));
    }
    return false;
  };
  React.useEffect(() => {
    sidebarSections.forEach(section => {
      section.items.forEach(item => {
        if (item.children && isParentActive(item) && !openItems.includes(item.key)) {
          setOpenItems(prev => [...prev, item.key]);
        }
      });
    });
  }, [location.pathname]);


  React.useEffect(() => {
    const active = navRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [location.pathname, isOpen]);

  const SidebarContent = () => (
    <nav
      ref={navRef}
      className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar"
    >
      {sidebarSections.map((section) => (
        <SidebarSection
          key={section.title}
          section={section}
          openItems={openItems}
          toggleItem={toggleItem}
          isActiveRoute={isActiveRoute}
          isParentActive={isParentActive}
          onClose={onClose}
          direction={direction}
          language={language}
          t={t}
        />
      ))}
    </nav>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-16 ${direction === 'rtl' ? 'right-0' : 'left-0'} h-[calc(100vh-4rem)] w-64 z-50 glass-sidebar transition-transform duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0'
            : direction === 'rtl'
            ? 'translate-x-full'
            : '-translate-x-full'
        } lg:top-16 lg:h-[calc(100vh-4rem)] ${
          isOpen
            ? 'lg:translate-x-0'
            : direction === 'rtl'
            ? 'lg:translate-x-full'
            : 'lg:-translate-x-full'
        } flex flex-col`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
