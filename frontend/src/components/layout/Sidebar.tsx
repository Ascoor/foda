import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { sidebarTranslations } from "@/i18n/sidebar";
import { sidebarSections } from "@/config/sidebar-sections";

export const Sidebar = () => {
  const { language, direction } = useLanguage();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const t = (key: string) =>
    sidebarTranslations[language][key as keyof typeof sidebarTranslations["en"]] ?? key;

  const isActive = (path?: string) =>
    !!path && location.pathname.startsWith(path);

  return (
    <motion.aside
      dir={direction}
      initial={{ x: direction === "rtl" ? 100 : -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed top-0 z-40 h-screen bg-[hsla(var(--surface)/0.85)] backdrop-blur-xl border-r border-[hsla(var(--border)/0.15)] shadow-lg flex flex-col transition-all duration-300",
        expanded ? "w-64" : "w-20",
        direction === "rtl" ? "right-0 border-l border-r-0" : "left-0"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-[hsla(var(--border)/0.1)]">
        <span className="font-bold text-lg text-foreground">
          {expanded ? (language === "ar" ? "لوحة التحكم" : "Dashboard") : "☰"}
        </span>
        <button
          onClick={() => setExpanded((p) => !p)}
          className="p-2 text-muted-foreground rounded-full hover:bg-[hsla(var(--primary)/0.15)]"
        >
          {expanded ? (direction === "rtl" ? "⟩" : "⟨") : (direction === "rtl" ? "⟨" : "⟩")}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 space-y-4">
        {sidebarSections.map((section) => (
          <div key={section.key}>
            {section.items ? (
              <>
                <p
                  className={cn(
                    "px-5 mb-2 text-[11px] uppercase font-semibold tracking-wider text-muted-foreground",
                    expanded ? "block" : "hidden"
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
                    {expanded && <span>{t(item.key)}</span>}
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
                {expanded && <span>{t(section.key)}</span>}
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
