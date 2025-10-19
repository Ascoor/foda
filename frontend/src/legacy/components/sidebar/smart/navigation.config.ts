import {
  BarChart3,
  Bell,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

export type NavigationItem = {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
  badge?: number;
  children?: NavigationItem[];
};

export const navigationItems: NavigationItem[] = [
  {
    key: "dashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    key: "users",
    label: "المستخدمون",
    icon: Users,
    path: "/users",
    children: [
      {
        key: "all_users",
        label: "جميع المستخدمين",
        icon: Users,
        path: "/users",
      },
      {
        key: "roles",
        label: "الأدوار",
        icon: Shield,
        path: "/users/roles",
      },
    ],
  },
  {
    key: "analytics",
    label: "التحليلات",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    key: "finance",
    label: "المالية",
    icon: Wallet,
    path: "/finance",
  },
  {
    key: "reports",
    label: "التقارير",
    icon: FileText,
    path: "/reports",
  },
  {
    key: "trends",
    label: "الاتجاهات",
    icon: TrendingUp,
    path: "/trends",
  },
  {
    key: "messages",
    label: "الرسائل",
    icon: MessageSquare,
    path: "/messages",
    badge: 3,
  },
  {
    key: "notifications",
    label: "الإشعارات",
    icon: Bell,
    path: "/notifications",
    badge: 12,
  },
  {
    key: "settings",
    label: "الإعدادات",
    icon: Settings,
    path: "/settings",
  },
];
