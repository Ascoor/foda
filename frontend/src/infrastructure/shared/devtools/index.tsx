import { useEffect } from "react";

import { useNotifications, NotificationItem } from "@/infrastructure/shared/contexts/NotificationContext";
import { useAuth } from "@/features/legacy/hooks/useAuth";

interface DevtoolsWindow extends Window {
  __FODA_DEVTOOLS__?: Record<string, unknown>;
}

export const DevTools = () => {
  const { user, isAuthenticated } = useAuth();

  let notifications: NotificationItem[] = [];
  let unreadCount: number = 0;
  let isDrawerOpen: boolean = false;

  try {
    const notifCtx = useNotifications();
    notifications = notifCtx.notifications;
    unreadCount = notifCtx.unreadCount;
    isDrawerOpen = notifCtx.isDrawerOpen;
  } catch {
    // useNotifications تم استدعاؤه خارج NotificationProvider
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const target = window as DevtoolsWindow;

    target.__FODA_DEVTOOLS__ = {
      notifications,
      unreadCount,
      isDrawerOpen,
      user,
      isAuthenticated,
    };

    return () => {
      target.__FODA_DEVTOOLS__ = {
        notifications: [],
        unreadCount: 0,
        isDrawerOpen: false,
        user: null,
        isAuthenticated: false,
      };
    };
  }, [isAuthenticated, isDrawerOpen, notifications, unreadCount, user]);

  return null;
};

export default DevTools;
