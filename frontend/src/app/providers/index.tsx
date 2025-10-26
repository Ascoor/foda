import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
  hydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import { getFromStore, setInStore } from "@shared/lib/idb";

import { DevTools } from "@shared/devtools";
import {
  LanguageProvider,
  NotificationProvider,
  OfflineProvider,
  ThemeProvider,
  RoleContext,
} from "@shared/contexts";
import { reportWebVitals } from "@shared/lib/web-vitals";
import { Toaster } from "@shared/ui/toaster";
import { Toaster as Sonner } from "@shared/ui/sonner";
import { TooltipProvider } from "@shared/ui/tooltip";
import { AuthProvider, useAuth } from "@legacy/hooks/useAuth";
import type { Role } from "@shared/contexts/role-context";

const RoleProviderBridge = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();

  const role = useMemo<Role | undefined>(() => {
    if (!user) {
      return undefined;
    }

    if (typeof user.role === "string" && user.role.length > 0) {
      return user.role as Role;
    }

    const fallback = user.roleNames?.find((name) => typeof name === "string");
    return fallback as Role | undefined;
  }, [user]);

  return <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>;
};

const QUERY_DB = "foda-app";
const QUERY_STORE = "react-query-cache";
const PERSIST_KEY = "rq-cache";

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 60 * 24,
            retry: 2,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    if (typeof window === "undefined" || import.meta.env.DEV) return;

    reportWebVitals((metric) => {
      const body = JSON.stringify({
        name: metric.name,
        id: metric.id,
        value: metric.value,
        delta: metric.delta,
        label: metric.label,
        navigationType: metric.navigationType,
        timestamp: Date.now(),
      });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/ops/web-vitals", body);
        return;
      }

      fetch("/api/ops/web-vitals", {
        method: "POST",
        body,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      }).catch((error) => console.error("Failed to submit web vitals", error));
    });
  }, []);

  useEffect(() => {
    const restoreCache = async () => {
      try {
        const cached = await getFromStore<DehydratedState>(QUERY_DB, QUERY_STORE, PERSIST_KEY);
        if (cached) {
          hydrate(queryClient, cached);
        }
      } catch (error) {
        console.error("Failed to restore query cache", error);
      }
    };

    restoreCache();

    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      const snapshot = dehydrate(queryClient);
      setInStore(QUERY_DB, QUERY_STORE, PERSIST_KEY, snapshot);
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineProvider>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <AuthProvider>
                <RoleProviderBridge>
                  <TooltipProvider>
                    {children}
                    <Toaster />
                    <Sonner />
                    {import.meta.env.DEV && <DevTools />}
                  </TooltipProvider>
                </RoleProviderBridge>
              </AuthProvider>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </OfflineProvider>
    </QueryClientProvider>
  );
};
