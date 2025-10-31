import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { router } from "@app/routes";
import { DevTools } from "@shared/devtools";
import { NotificationProvider } from "@shared/contexts/NotificationContext";
import { LanguageProvider } from "@shared/contexts/LanguageContext";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { FeatureFlagProvider } from "@shared/contexts/FeatureFlagContext";
import { Toaster } from "@shared/ui/toaster";
import { Toaster as Sonner } from "@shared/ui/sonner";
import { TooltipProvider } from "@shared/ui/tooltip";
import { AuthProvider } from "@legacy/hooks/useAuth";
import { NewAuthProvider } from "@shared/contexts/AuthContext";

import "@/i18n";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <NewAuthProvider>
              <NotificationProvider>
                <FeatureFlagProvider>
                  <TooltipProvider>
                    <RouterProvider router={router} />
                    <Toaster />
                    <Sonner />
                    {import.meta.env.DEV && <DevTools />}
                  </TooltipProvider>
                </FeatureFlagProvider>
              </NotificationProvider>
            </NewAuthProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
