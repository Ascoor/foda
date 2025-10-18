import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, FileText, Megaphone, Settings } from "lucide-react";

export interface SidebarItemConfig {
  key: string;
  icon: LucideIcon;
  path: string;
  roles?: string[];
  relatedKeys?: string[];
}

export interface SidebarSectionConfig {
  key: string;
  items?: SidebarItemConfig[];
  icon?: LucideIcon;
  path?: string;
  roles?: string[];
}

export const sidebarSections: SidebarSectionConfig[] = [
  {
    key: "dashboard_home",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    key: "people_management",
    icon: Users,
    path: "/dashboard/users",
  },
  {
    key: "reports_center",
    icon: FileText,
    path: "/dashboard/reports",
  },
  {
    key: "campaigns_suite",
    icon: Megaphone,
    path: "/dashboard/campaigns",
  },
  {
    key: "settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];
