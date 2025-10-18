 
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate,NavLink, useLocation } from 'react-router-dom';
import { sidebarSections } from "@/config/sidebar-sections";
 
import { useLanguage } from "@/contexts/LanguageContext";
export const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { language, direction } = useLanguage();
  const t = (key: string) =>
    sidebarTranslations[language][key as keyof typeof sidebarTranslations["en"]] ?? key;

  const isActive = (path?: string) =>
    !!path && location.pathname.startsWith(path);
  return (
    <motion.aside
    initial={{ x: -120, opacity: 0, scale: 0.9 }}
    animate={{ 
      x: 0, 
      opacity: 1, 
      scale: 1,
      width: isExpanded ? 240 : 72 
    }}
    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
    onMouseEnter={() => setIsExpanded(true)}
    onMouseLeave={() => setIsExpanded(false)}
    className="fixed ltr:left-4 rtl:right-4 top-28 bottom-8 z-40 rounded-[32px] border border-border/30 p-5"
    style={{ 
      background: 'linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--card) / 0.7))',
      backdropFilter: 'blur(20px) saturate(180%)',
      boxShadow: 'var(--shadow-neomorph-raised), 0 8px 32px hsla(var(--primary) / 0.08)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)'
    }}
  >
    {/* Carved edge effect */}
    <div 
      className="absolute inset-0 rounded-[32px] pointer-events-none"
      style={{ boxShadow: 'inset 3px 3px 8px hsla(0, 0%, 0%, 0.08), inset -3px -3px 8px hsla(255, 255%, 255%, 0.05)' }}
    />
    
    {/* Side glow for dark mode */}
    <div className="absolute ltr:right-0 rtl:left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-0 dark:opacity-100" />
    
    <nav className="h-full flex flex-col gap-3 relative z-10 overflow-y-auto">
 
        {sidebarSections.map((section) => (
          <div key={section.key}>
            {section.items ? (
              <>
                <p
                  className={cn(
                    "px-5 mb-2 text-[11px] uppercase font-semibold tracking-wider text-muted-foreground",
                    isExpanded ? "block" : "hidden"
                  )}
                >
                  {t(section.key)}
                </p>
                {section.items.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    className={({ isActive: active }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm",
                        active || isActive(item.path)
                          ? "bg-[hsla(var(--primary)/0.2)] text-[hsl(var(--primary))] font-semibold"
                          : "text-muted-foreground hover:bg-[hsla(var(--primary)/0.08)] hover:text-foreground"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {isExpanded && <span>{t(item.key)}</span>}
                  </NavLink>
                ))}
              </>
            ) : (
              <NavLink
                to={section.path ?? "#"}
                className={({ isActive: active }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm",
                    active || isActive(section.path)
                      ? "bg-[hsla(var(--primary)/0.2)] text-[hsl(var(--primary))] font-semibold"
                      : "text-muted-foreground hover:bg-[hsla(var(--primary)/0.08)] hover:text-foreground"
                  )
                }
              >
                {section.icon && <section.icon className="h-4 w-4 shrink-0" />}
                {isExpanded && <span>{t(section.key)}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-[hsla(var(--border)/0.1)] p-3 text-xs text-center text-muted-foreground">
        {language === "ar"
          ? "© جميع الحقوق محفوظة"
          : "© All rights reserved"}
      </div>
    </motion.aside>
  );
};
