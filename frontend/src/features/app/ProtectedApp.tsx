import { Outlet } from "react-router-dom";

import { NotificationProvider } from "@/infrastructure/shared/contexts/NotificationContext";
import { CampaignProvider } from "@/infrastructure/shared/contexts/CampaignContext";
import { ThemeProvider } from "@/infrastructure/shared/contexts/ThemeContext";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";
import { TooltipProvider } from "@/infrastructure/shared/ui/tooltip";

export const ProtectedApp = () => (
  <CampaignProvider>
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  </CampaignProvider>
);
