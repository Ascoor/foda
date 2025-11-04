import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode
} from "react";
import { request } from "@/infrastructure/shared/lib/api";
import { getEcho } from "@/infrastructure/shared/lib/echo";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

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
  setFilter: (f: NotificationFilter) => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
};

// Echo typing (خفيفة)
type EchoChannelLike = {
  listen: (event: string, cb: (payload: any) => void) => void;
  stopListening: (event: string, cb: (payload: any) => void) => void;
};
type EchoLike = { channel: (name: string) => EchoChannelLike };
const isEchoLike = (x: unknown): x is EchoLike => !!x && typeof (x as any).channel === "function";

type Props = { children: ReactNode; enabled?: boolean };

export const NotificationProvider = ({ children, enabled = true }: Props) => {
  const { isAuthenticated } = useAuth();

  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  // لا تشغّل أي منطق قبل الدخول + التوكن + تمكين المزوّد
  const disabled = !enabled || !isAuthenticated || !hasToken;

  // Hooks دائماً بنفس الترتيب
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const fetchNotifications = useCallback(
    async ({ showLoader = true, suppressToasts = true } = {}) => {
      if (disabled) return;
      if (showLoader) setLoading(true);
      try {
        const res = await request<{ data: NotificationItem[] }>({
          url: "/notifications",
          method: "get",
          params: { per_page: 50 },
        });

        const incoming = [...(res.data ?? [])].sort(
          (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
        );

        setNotifications(prev => {
          const prevIds = new Set(prev.map(n => n.id));
          const newItems = incoming.filter(n => !prevIds.has(n.id));
          if (!suppressToasts) {
            newItems
              .filter(n => n.priority === "high")
              .forEach(n => toast(n.title, { description: n.message }));
          }
          return incoming;
        });
      } catch (e) {
        // تجاهل هدوء ERR_CANCELED / ERR_NETWORK في التطوير
        console.error("Failed to load notifications", e);
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [disabled]
  );

  // أول تحميل
  useEffect(() => {
    if (disabled) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    void fetchNotifications({ showLoader: true, suppressToasts: true });
  }, [disabled, fetchNotifications]);

  // Polling كل 60 ثانية
  useEffect(() => {
    if (disabled) return;
    const id = window.setInterval(() => {
      void fetchNotifications({ showLoader: false, suppressToasts: false });
    }, 60_000);
    return () => window.clearInterval(id);
  }, [disabled, fetchNotifications]);

  // بث لحظي عبر Echo
  useEffect(() => {
    if (disabled) return;
    const maybeEcho = getEcho();
    if (!isEchoLike(maybeEcho)) return;

    const channel = maybeEcho.channel("notifications");
    const handler = (p: { data: NotificationItem }) => {
      setNotifications(prev => {
        const existing = prev.filter(x => x.id !== p.data.id);
        const next = [p.data, ...existing].sort(
          (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
        );
        return next;
      });
      if (p.data.priority === "high") {
        toast(p.data.title, { description: p.data.message });
      }
    };

    channel.listen(".App\\Events\\NotificationCreated", handler);
    return () => channel.stopListening(".App\\Events\\NotificationCreated", handler);
  }, [disabled]);

  const markAsRead = useCallback(async (id: number) => {
    if (disabled) return;
    await request({ url: `/notifications/${id}/read`, method: "patch" });
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  }, [disabled]);

  const markAllAsRead = useCallback(async () => {
    if (disabled) return;
    await request({ url: "/notifications/read-all", method: "post" });
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
  }, [disabled]);

  const filteredNotifications = useMemo(
    () => (filter === "all" ? notifications : notifications.filter(n => n.type === filter)),
    [filter, notifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read_at).length,
    [notifications]
  );

  const valueWhenDisabled: NotificationContextValue = {
    notifications: [],
    filteredNotifications: [],
    unreadCount: 0,
    loading: false,
    filter,
    setFilter,
    markAsRead: async () => {},
    markAllAsRead: async () => {},
    refresh: async () => {},
    isDrawerOpen,
    setDrawerOpen,
  };

  const valueActive: NotificationContextValue = {
    notifications,
    filteredNotifications,
    unreadCount,
    loading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    refresh: () => fetchNotifications({ showLoader: true, suppressToasts: true }),
    isDrawerOpen,
    setDrawerOpen,
  };

  return (
    <NotificationContext.Provider value={disabled ? valueWhenDisabled : valueActive}>
      {children}
    </NotificationContext.Provider>
  );
};
