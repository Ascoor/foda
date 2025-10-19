import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "@/shared/contexts/auth-context";
import { RoleContext } from "@/shared/contexts/role-context";
import { LanguageProvider } from "@/shared/contexts/language-context";
import { NotificationProvider } from "@/shared/contexts/notification-context";
import { ThemeProvider } from "@/shared/contexts/theme-context";
import i18n from "@/i18n/config";
import { useAuth } from "@/shared/hooks";

const queryClient = new QueryClient();

type AppProvidersProps = {
  children: ReactNode;
};

const RoleProviderBridge = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return <RoleContext.Provider value={{ role: user?.role }}>{children}</RoleContext.Provider>;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <RoleProviderBridge>
          <ThemeProvider>
            <LanguageProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </LanguageProvider>
          </ThemeProvider>
        </RoleProviderBridge>
      </AuthProvider>
    </I18nextProvider>
  </QueryClientProvider>
);
