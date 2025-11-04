import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { router } from "@/features/app/routes";
import { DevTools } from "@/infrastructure/shared/devtools";
import { NotificationProvider } from "@/infrastructure/shared/contexts/NotificationContext";
import { LanguageProvider } from "@/infrastructure/shared/contexts/LanguageContext";
import { ThemeProvider } from "@/infrastructure/shared/contexts/ThemeContext";
import { FeatureFlagProvider } from "@/infrastructure/shared/contexts/FeatureFlagContext";
import { CampaignProvider } from "@/infrastructure/shared/contexts/CampaignContext";
import { Toaster } from "@/infrastructure/shared/ui/toaster";
import { Toaster as Sonner } from "@/infrastructure/shared/ui/sonner";
import { TooltipProvider } from "@/infrastructure/shared/ui/tooltip";
import { AuthProvider } from "@/features/legacy/hooks/useAuth";

import "@/infrastructure/i18n";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FeatureFlagProvider>
        <AuthProvider>
          <CampaignProvider>
            <ThemeProvider>
              <LanguageProvider>
                <NotificationProvider>
                  <TooltipProvider>
                    <RouterProvider router={router} />
                    <Toaster />
                    <Sonner />
                    {import.meta.env.DEV && <DevTools />}
                  </TooltipProvider>
                </NotificationProvider>
              </LanguageProvider>
            </ThemeProvider>
          </CampaignProvider>
        </AuthProvider>
      </FeatureFlagProvider>
    </QueryClientProvider>
  );
}
