import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";
import { cn } from "@/infrastructure/shared/lib/utils";
import { Button } from "@/infrastructure/shared/ui/button";

import { SidebarContainer, SidebarProvider, SidebarRail, useSidebar } from "../core";
import { SidebarContent, SidebarFooter, SidebarHeader } from "../ui";

import { navigationItems } from "./navigation.config";
import { SmartNavigation } from "./SmartNavigation";

export interface SmartSidebarProps {
  defaultCollapsed?: boolean;
  side?: "left" | "right";
}

export const SmartSidebar: React.FC<SmartSidebarProps> = ({
  defaultCollapsed = true,
  side,
}) => {
  const { direction } = useLanguage();
  const computedSide = side ?? (direction === "rtl" ? "right" : "left");

  return (
    <SidebarProvider defaultOpen={!defaultCollapsed}>
      <SmartSidebarLayout side={computedSide} />
    </SidebarProvider>
  );
};

interface SmartSidebarLayoutProps {
  side: "left" | "right";
}

const SmartSidebarLayout: React.FC<SmartSidebarLayoutProps> = ({ side }) => {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const { state, toggleSidebar, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isRTL = direction === "rtl";

  const ExpandIcon = side === "right" ? ChevronLeft : ChevronRight;
  const CollapseIcon = side === "right" ? ChevronRight : ChevronLeft;

  const handleNavigate = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  return (
    <SidebarContainer
      side={side}
      variant="floating"
      collapsible="icon"
      className="[&>[data-sidebar=sidebar]]:bg-transparent"
    >
      <SidebarRail />
      <div className="glass-card flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-sidebar/80 text-sidebar-foreground backdrop-blur-xl">
        <SidebarHeader className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div
            className={cn(
              "flex items-center gap-3",
              isRTL && "flex-row-reverse text-right",
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isRTL ? 12 : -12 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold text-gradient-primary"
                >
                  {t("app.name", "ProDash")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="glass-button"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="glass"
              size="icon"
              onClick={toggleSidebar}
              className="hidden h-9 w-9 lg:flex"
            >
              {isCollapsed ? (
                <ExpandIcon className="h-4 w-4" />
              ) : (
                <CollapseIcon className="h-4 w-4" />
              )}
            </Button>
          )}
        </SidebarHeader>

        <SidebarContent className="flex-1 p-4">
          <SmartNavigation items={navigationItems} onNavigate={handleNavigate} />
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 px-4 py-3">
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs text-muted-foreground"
              >
                ProDash v3.0
              </motion.div>
            )}
          </AnimatePresence>
        </SidebarFooter>
      </div>
    </SidebarContainer>
  );
};
