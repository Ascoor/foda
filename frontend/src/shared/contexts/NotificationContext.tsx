import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { request } from "@shared/lib/api";
import { getEcho } from "@shared/lib/echo";
import { toast } from "sonner";
import { useLanguage } from "@shared/contexts/LanguageContext";

export type NotificationType =
  | "performance"
  | "field"
  | "risk"
  | "other"
  | "success";

export interface NotificationItem {
  id: number | string;
  type: NotificationType;
  category: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  meta?: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  created_ago?: string;
  createdAgo?: string;
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
  markAsRead: (id: NotificationItem["id"]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  pushNotification: (notification: NotificationItem) => void;
  push: (notification: NotificationItem) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

interface PaginatedNotificationResponse {
  data: NotificationItem[];
}

const normalizeNotification = (incoming: NotificationItem): NotificationItem => {
  const fallback = new Date(incoming.created_at).toLocaleString();
  const createdAgo = incoming.createdAgo ?? incoming.created_ago ?? fallback;

  return {
    ...incoming,
    createdAgo,
    created_ago: incoming.created_ago ?? createdAgo,
  };
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const fetchNotifications = useCallback(
    async ({ showLoader = true, suppressToasts = false } = {}) => {
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

        const incoming = [...(response.data ?? [])]
          .map(normalizeNotification)
          .sort(
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
    [],
  );

  const prependNotification = useCallback((incoming: NotificationItem) => {
    const normalized = normalizeNotification(incoming);
    setNotifications((prev) => {
      const existing = prev.filter((item) => item.id !== normalized.id);
      const next = [normalized, ...existing];
      return next.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    });
  }, []);

  useEffect(() => {
    fetchNotifications({ showLoader: true, suppressToasts: true });
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchNotifications({ showLoader: false, suppressToasts: false });
    }, 60000);

    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
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
  }, [prependNotification]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storageKey = "foda-brand-identity-refresh";
    if (window.localStorage.getItem(storageKey) === "done") {
      return;
    }

    const now = new Date().toISOString();
    const notification: NotificationItem = {
      id: Number.MIN_SAFE_INTEGER,
      type: "other",
      category: "brand-refresh",
      title:
        language === "ar"
          ? "تم تحديث هوية التطبيق!"
          : "Brand Identity Updated!",
      message:
        language === "ar"
          ? "تم إطلاق الهوية الجديدة Foda Elections | فوده مننا بألوان مميزة وشعار جديد 🎨"
          : "The new Foda Elections | Foda Minnna brand identity is now live! 🎨",
      priority: "low",
      meta: { source: "brand-refresh", tone: "success" },
      read_at: null,
      created_at: now,
      createdAgo: new Date(now).toLocaleString(),
      is_high_priority: false,
    };

    prependNotification(notification);
    window.localStorage.setItem(storageKey, "done");
  }, [language, prependNotification]);

  const markAsRead = useCallback(async (id: NotificationItem["id"]) => {
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
    pushNotification: prependNotification,
    push: prependNotification,
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
