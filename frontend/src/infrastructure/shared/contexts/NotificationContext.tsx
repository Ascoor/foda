import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { request } from "@/infrastructure/shared/lib/api";
import { getEcho } from "@/infrastructure/shared/lib/echo";
import { toast } from "sonner";
import { useAuth } from "@/features/legacy/hooks/useAuth";

export type NotificationType = "performance" | "field" | "risk" | "other";

export interface NotificationItem {
  id: number;
  type: NotificationType;
  category: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  meta: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  created_ago?: string;
  is_high_priority?: boolean;
}

type NotificationFilter = "all" | NotificationType;

interface NotificationContextValue {
  notifications: NotificationItem[];
  filteredNotifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

interface PaginatedNotificationResponse {
  data: NotificationItem[];
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const fetchNotifications = useCallback(
    async ({ showLoader = true, suppressToasts = false } = {}) => {
      if (!isAuthenticated || authLoading) {
        return;
      }
      if (showLoader) {
        setLoading(true);
      }
      try {
        const response = await request<PaginatedNotificationResponse>({
          url: "/notifications",
          method: "get",
          params: {
            per_page: 50,
          },
        });

        const incoming = [...(response.data ?? [])].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setNotifications((previous) => {
          const previousIds = new Set(previous.map((item) => item.id));
          const newItems = incoming.filter((item) => !previousIds.has(item.id));

          if (!suppressToasts) {
            newItems
              .filter((item) => item.priority === "high")
              .forEach((item) => {
                toast(item.title, {
                  description: item.message,
                });
              });
          }

          return incoming;
        });
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [isAuthenticated, authLoading],
  );

  const prependNotification = useCallback((incoming: NotificationItem) => {
    setNotifications((prev) => {
      const existing = prev.filter((item) => item.id !== incoming.id);
      const next = [incoming, ...existing];
      return next.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    });
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    fetchNotifications({ showLoader: true, suppressToasts: true });
  }, [fetchNotifications, isAuthenticated, authLoading]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      fetchNotifications({ showLoader: false, suppressToasts: false });
    }, 60000);

    return () => window.clearInterval(interval);
  }, [fetchNotifications, isAuthenticated, authLoading]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      return undefined;
    }

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("notifications");
    const handler = (payload: { data: NotificationItem }) => {
      const notification = payload.data;
      prependNotification(notification);

      if (notification.priority === "high") {
        toast(notification.title, {
          description: notification.message,
        });
      }
    };

    channel.listen(".App\\Events\\NotificationCreated", handler);

    return () => {
      channel.stopListening(".App\\Events\\NotificationCreated", handler);
    };
  }, [isAuthenticated, prependNotification]);

  const markAsRead = useCallback(async (id: number) => {
    await request<{ data: NotificationItem }>({
      url: `/notifications/${id}/read`,
      method: "patch",
    });

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read_at: new Date().toISOString() }
          : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await request({
      url: "/notifications/read-all",
      method: "post",
    });

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read_at: new Date().toISOString(),
      })),
    );
  }, []);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((notification) => notification.type === filter);
  }, [filter, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read_at).length,
    [notifications],
  );

  const value: NotificationContextValue = {
    notifications,
    filteredNotifications,
    unreadCount,
    loading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    refresh: () =>
      fetchNotifications({ showLoader: true, suppressToasts: true }),
    isDrawerOpen,
    setDrawerOpen,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }

  return context;
};