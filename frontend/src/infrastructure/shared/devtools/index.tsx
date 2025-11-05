import { useEffect } from "react";
import { useAuth } from "@/features/legacy/hooks/useAuth";
import type { NotificationItem } from "@/infrastructure/shared/contexts/NotificationContext";

interface DevtoolsWindow extends Window {
  __FODA_DEVTOOLS__?: Record<string, unknown>;
}

const registerDevtools = (payload: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  const target = window as DevtoolsWindow;
  target.__FODA_DEVTOOLS__ = { ...target.__FODA_DEVTOOLS__, ...payload };
  if (import.meta.env.DEV) {
    console.info("[DevTools] context payload updated", target.__FODA_DEVTOOLS__);
  }
};

export const DevTools = () => {
  const { user, isAuthenticated } = useAuth();

  // استخدم متغيرات محلية بدلاً من hook مباشرة
  let notifications: NotificationItem[] = [];
  let unreadCount = 0;
  let isDrawerOpen = false;

  try {
    if (isAuthenticated) {
      const notif = require("@/infrastructure/shared/contexts/NotificationContext").useNotifications();
      notifications = notif.notifications;
      unreadCount = notif.unreadCount;
      isDrawerOpen = notif.isDrawerOpen;
    }
  } catch (err) {
    // تجاهل الخطأ إن لم تكن داخل NotificationProvider
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

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
