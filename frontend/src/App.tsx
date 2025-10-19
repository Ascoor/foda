import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
<<<<<<< HEAD

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { router } from "@app/routes";

 

import { Toaster } from "@shared/ui/toaster";
import { Toaster as Sonner } from "@shared/ui/sonner";
import { TooltipProvider } from "@shared/ui/tooltip";
import { AuthProvider } from "@shared/contexts/AuthContext";
import { LanguageProvider } from "@shared/contexts/LanguageContext";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { router } from "@app/routes";
 
import "@/i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={router} />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
