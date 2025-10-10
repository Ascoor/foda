import { Fragment, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Vote,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { sidebarItems } from './sidebarItems';

interface SidebarProps {
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  isMobile: boolean;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const Sidebar = ({
  collapsed,
  onCollapseChange,
  isMobile,
  isMobileSidebarOpen,
  setMobileSidebarOpen,
}: SidebarProps) => {
  const { language, direction, t } = useLanguage();
  const { user } = useAuth();
  const isRTL = direction === 'rtl';

  // 🎯 صلاحيات المستخدم
  const availableRoles = useMemo(() => {
    const rawRoles = user?.roleNames ?? user?.roles?.map((r) => r.name) ?? [];
    return new Set(rawRoles.map((r) => r.toLowerCase()));
  }, [user]);

  // 🔍 تصفية العناصر بناءً على الأدوار
  const filteredItems = useMemo(
    () =>
      sidebarItems.filter((item) => {
        if (!item.roles?.length) return true;
        return item.roles.some((role) => availableRoles.has(role.toLowerCase()));
      }),
    [availableRoles]
  );

  // 🌍 ترجمة العنصر
  const renderNavItem = (key: string) =>
    t(`navigation.${key}`, { defaultValue: key.replace('_', ' ') });
  const renderDesktopNav = () => (
    <TooltipProvider delayDuration={100}>
      <nav
    className={cn(
      'flex-1 overflow-y-auto transition-all duration-300 px-3 pb-6',
      collapsed && 'overflow-hidden scrollbar-hide',
      isRTL ? 'pr-4 text-right' : 'pl-4 text-left'
    )}
    dir={direction}
  >
    <ul
      className={cn(
        'flex flex-col gap-1.5',
        isRTL ? 'items-end justify-end' : 'items-start justify-start'
      )}
    >
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const content = (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 w-full',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-primary/15 text-primary dark:text-[#E7B10A]'
                  : 'text-foreground/70 hover:text-primary hover:bg-primary/10 dark:hover:text-[#E7B10A]',
                isRTL
                  ? 'flex-row-reverse justify-end text-right'
                  : 'flex-row justify-start text-left'
              )
            }
          >
            {isRTL ? (
              <>
                <Icon className="h-5 w-5 shrink-0 order-last ml-2 group-hover:scale-110 group-hover:text-[#E7B10A] transition-transform duration-200" />
                {!collapsed && (
                  <span className="truncate text-sm">{renderNavItem(item.key)}</span>
                )}
              </>
            ) : (
              <>
                <Icon className="h-5 w-5 shrink-0 order-first mr-2 group-hover:scale-110 group-hover:text-[#E7B10A] transition-transform duration-200" />
                {!collapsed && (
                  <span className="truncate text-sm">{renderNavItem(item.key)}</span>
                )}
              </>
            )}
          </NavLink>
        );

        return (
          <li key={item.key} className={cn(isRTL && 'w-full flex justify-end')}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent
                  side={isRTL ? 'left' : 'right'}
                  className="bg-background/90 text-foreground shadow-md backdrop-blur-md border border-border/10"
                >
                  {renderNavItem(item.key)}
                </TooltipContent>
              </Tooltip>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  </nav>

    </TooltipProvider>
  );
  

  // 📱 شريط الموبايل
  const renderMobileNav = () => (
    <nav
      className="mt-6 flex flex-col gap-2"
      aria-label={t('navigation.main', { defaultValue: 'Main navigation' })}
      dir={direction}
    >
      {filteredItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.key}
            to={item.path}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-[#E7B10A]/25 text-white'
                  : 'text-white/85 hover:bg-[#E7B10A]/15 hover:text-white',
                isRTL && 'flex-row-reverse'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{renderNavItem(item.key)}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  // 🏷️ بيانات العلامة والإصدار
  const brandLabel = language === 'ar' ? 'فودا برو' : 'Foda Pro';
  const versionLabel = language === 'ar' ? 'الإصدار 1.0.0' : 'Version 1.0.0';
  const expandedWidth = collapsed ? '5rem' : '17rem';

  // 🧩 واجهة الشريط الكامل
  return (
    <Fragment>
      {/* 💻 Desktop Sidebar */}
      {!isMobile && (
       <aside
       dir={direction}
       className={cn(
         'fixed top-0 z-40 hidden h-full flex-col transition-[width,background,box-shadow] duration-500 ease-in-out md:flex',
         'backdrop-blur-lg shadow-2xl border-r border-border/10',
         'supports-[backdrop-filter]:bg-gradient-to-b supports-[backdrop-filter]:from-background/80 supports-[backdrop-filter]:to-background/40',
         'dark:from-[#0F1E2E]/90 dark:to-[#162C46]/80 dark:border-[#E7B10A]/20',
         'bg-gradient-to-b from-white/70 to-white/50 text-foreground/90',
         isRTL ? 'right-0 border-l' : 'left-0 border-r',
         collapsed ? 'w-20' : 'w-72'
       )}
     >{/* 🧩 الرأس */}
     <div
       className={cn(
         'relative flex h-20 items-center px-4 justify-center transition-all duration-300',
         isRTL && 'flex-row-reverse'
       )}
     >
       {/* ====== زر الفتح/الإغلاق ثابت على الحافة ====== */}
       <motion.div
         className={cn(
           'absolute top-1/2 -translate-y-1/2 z-50',
           isRTL ? 'left-0 translate-x-1/2' : 'right-0 -translate-x-1/2'
         )}
         transition={{ type: 'spring', stiffness: 200, damping: 20 }}
       >
         <Button
           variant="ghost"
           size="icon"
           className={cn(
             'h-10 w-10 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-[#E7B10A]/20 transition-all duration-300 shadow-lg',
             'backdrop-blur-md'
           )}
           onClick={() => onCollapseChange(!collapsed)}
         >
           {isRTL ? (
             collapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
           ) : collapsed ? (
             <ChevronRight className="h-5 w-5" />
           ) : (
             <ChevronLeft className="h-5 w-5" />
           )}
         </Button>
       </motion.div>
     
       {/* ====== البراند والشعار ====== */}
       <div
         className={cn(
           'flex items-center gap-3 transition-all duration-500 ease-in-out',
           isRTL && 'flex-row-reverse',
           collapsed && 'justify-center gap-2'
         )}
       >
       
         {!collapsed && (
           <motion.span
             initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.4 }}
             className={cn(
               'text-lg font-semibold tracking-wide select-none transition-colors duration-300',
               'text-[#1C3F60] dark:text-[#E7B10A]'
             )}
           >
             {brandLabel}
           </motion.span>
         )}
           <motion.div
           whileHover={{ scale: 1.1, rotate: 3 }}
           whileTap={{ scale: 0.95 }}
           className={cn(
             'relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300',
             'bg-[#E7B10A] text-[#1C3F60] shadow-md dark:bg-[#E7B10A]/90 dark:text-[#0B1A2A]',
             'ring-1 ring-white/10 hover:ring-[#E7B10A]/50 hover:shadow-[0_0_10px_#E7B10A66]'
           )}
         >
           <Vote className="h-5 w-5 transition-transform duration-300" />
           <div className="absolute inset-0 rounded-xl bg-[#E7B10A]/20 blur-md opacity-60 dark:opacity-80" />
         </motion.div>
     
       </div>
     </div>
     
          {renderDesktopNav()}

          {/* ⬇️ الفوتر */}
          <div
            className={cn(
              'px-4 pb-6 text-xs text-white/65',
              collapsed && 'text-center'
            )}
          >
            {collapsed ? (
              <span>{versionLabel}</span>
            ) : (
              <span className="tracking-wide">{versionLabel}</span>
            )}
          </div>
        </aside>
      )}

      {/* 📱 Mobile Sidebar */}
      {isMobile && (
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <motion.aside
                dir={direction}
                className={cn(
                  'absolute top-0 flex h-full w-72 flex-col bg-[#1C3F60] px-5 pb-8 pt-6 text-white shadow-2xl',
                  isRTL ? 'right-0' : 'left-0'
                )}
                initial={{ x: isRTL ? 300 : -300 }}
                animate={{ x: 0 }}
                exit={{ x: isRTL ? 300 : -300 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={cn(
                    'flex items-center justify-between',
                    isRTL && 'flex-row-reverse'
                  )}
                >
                  <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7B10A] text-[#1C3F60] shadow-md">
                      <Vote className="h-5 w-5" />
                    </div>
                    <span className="text-base font-semibold">{brandLabel}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {renderMobileNav()}
                <p className="mt-auto text-xs text-white/70">{versionLabel}</p>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Fragment>
  );
};