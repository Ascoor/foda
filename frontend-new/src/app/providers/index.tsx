import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/shared/contexts/auth-context";
import { LanguageProvider } from "@/shared/contexts/language-context";
import { NotificationProvider } from "@/shared/contexts/notification-context";
import { ThemeProvider } from "@/shared/contexts/theme-context";
import i18n from "@/i18n/config";

const queryClient = new QueryClient();

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </I18nextProvider>
  </QueryClientProvider>
);
