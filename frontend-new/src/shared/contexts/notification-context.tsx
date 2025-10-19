import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiClient, ApiResponse } from "@/shared/api/config";
import { NotificationDTO } from "@/shared/api/dtos";
import { useRealtime } from "@/shared/hooks";

type NotificationType = NotificationDTO["type"];

export type NotificationItem = NotificationDTO & {
  createdAgo?: string;
};

type NotificationFilter = "all" | NotificationType;

type NotificationContextValue = {
  notifications: NotificationItem[];
  filteredNotifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  filter: NotificationFilter;
  setFilter: (value: NotificationFilter) => void;
  markAsRead: (id: NotificationItem["id"]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
  push: (notification: NotificationItem) => void;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

type NotificationsResponse = ApiResponse<NotificationDTO[]>;

const mapNotification = (dto: NotificationDTO): NotificationItem => ({
  ...dto,
  createdAgo: new Date(dto.created_at).toLocaleString(),
});

const mergeNotifications = (
  current: NotificationItem[],
  incoming: NotificationItem[],
) => {
  const existing = new Map(current.map((item) => [item.id, item]));
  incoming.forEach((item) => {
    existing.set(item.id, item);
  });

  return Array.from(existing.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
};

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get<NotificationsResponse>("/notifications");
      const mapped = (data.data ?? []).map(mapNotification);
      setNotifications((previous) => mergeNotifications(previous, mapped));
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: NotificationItem["id"]) => {
    await apiClient.post(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, read_at: new Date().toISOString() }
          : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await apiClient.post("/notifications/read-all");
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read_at: new Date().toISOString(),
      })),
    );
  }, []);

  const push = useCallback((notification: NotificationItem) => {
    setNotifications((prev) => mergeNotifications(prev, [notification]));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
// 🔒 مؤقتاً تم إيقاف التحديث الفوري أثناء التطوير
// لتجنب أخطاء WebSocket وعدم الاتصال بالخادم
/*
useRealtime<NotificationDTO>("notification.created", {
  event: "notification.created",
  namespace: "notifications",
  onMessage: (payload) => {
    push(mapNotification(payload));
  },
});
*/
  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((notification) => notification.type === filter);
  }, [filter, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read_at).length,
    [notifications],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      filteredNotifications,
      unreadCount,
      loading,
      filter,
      setFilter,
      markAsRead,
      markAllAsRead,
      refresh: fetchNotifications,
      push,
      isDrawerOpen,
      setDrawerOpen,
    }),
    [
      fetchNotifications,
      filter,
      filteredNotifications,
      isDrawerOpen,
      loading,
      markAllAsRead,
      markAsRead,
      notifications,
      push,
      unreadCount,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }

  return context;
};
