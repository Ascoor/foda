import { useEffect } from "react";

import { useNotifications } from "@shared/contexts/NotificationContext";
import { useAuth } from "@legacy/hooks/useAuth";

interface DevtoolsWindow extends Window {
  __FODA_DEVTOOLS__?: Record<string, unknown>;
}

const registerDevtools = (payload: Record<string, unknown>) => {
  if (typeof window === "undefined") {
    return;
  }

  const target = window as DevtoolsWindow;
  target.__FODA_DEVTOOLS__ = {
    ...target.__FODA_DEVTOOLS__,
    ...payload,
  };

  if (import.meta.env.DEV) {
    console.info(
      "[DevTools] context payload updated",
      target.__FODA_DEVTOOLS__,
    );
  }
};

export const DevTools = () => {
  const { notifications, unreadCount, isDrawerOpen } = useNotifications();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    registerDevtools({
      notifications,
      unreadCount,
      isDrawerOpen,
      user,
      isAuthenticated,
    });

    return () => {
      registerDevtools({
        notifications: [],
        unreadCount: 0,
        isDrawerOpen: false,
        user: null,
        isAuthenticated: false,
      });
    };
  }, [isAuthenticated, isDrawerOpen, notifications, unreadCount, user]);

  return null;
};

export default DevTools;
