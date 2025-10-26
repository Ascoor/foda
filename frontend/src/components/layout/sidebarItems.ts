import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Vote,
  MapPin,
  Users,
  UserCheck,
  Crown,
  Shield,
  Heart,
  Eye,
  Megaphone,
  BarChart3,
  Settings,
  Cpu,
  FileText,
  AlertTriangle,
  Database,
  Lock,
  Network,
  Layers,
  Globe,
  Activity,
} from "lucide-react";

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
  // 🟢 لوحة القيادة (Dashboard)
  {
    key: "dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["Admin", "FieldLead", "Agent"],
  },

  // 🟠 العمليات الانتخابية
  {
    key: "section_election_operations",
    icon: Vote,
    items: [
      {
        key: "elections",
        icon: Vote,
        path: "/elections",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "geo_areas",
        icon: MapPin,
        path: "/geo-areas",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "committees",
        icon: Users,
        path: "/committees",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "voters",
        icon: UserCheck,
        path: "/voters",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "candidates",
        icon: Crown,
        path: "/candidates",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "results_center",
        icon: BarChart3,
        path: "/results",
        roles: ["Admin", "FieldLead"],
      },
    ],
  },

  // 🟡 الموارد الميدانية
  {
    key: "section_field_resources",
    icon: Shield,
    items: [
      {
        key: "agents",
        icon: Shield,
        path: "/agents",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "volunteers",
        icon: Heart,
        path: "/volunteers",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "observers",
        icon: Eye,
        path: "/observers",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "field_reports",
        icon: FileText,
        path: "/reports",
        roles: ["Admin", "FieldLead", "Agent"],
      },
    ],
  },

  // 🔵 التحليل والمراقبة
  {
    key: "section_monitoring_and_analytics",
    icon: Activity,
    items: [
      {
        key: "live_map",
        icon: Globe,
        path: "/monitoring/map",
        roles: ["Admin", "FieldLead"],
      },
      {
        key: "statistics",
        icon: BarChart3,
        path: "/analytics/statistics",
        roles: ["Admin"],
      },
      {
        key: "alerts",
        icon: AlertTriangle,
        path: "/monitoring/alerts",
        roles: ["Admin", "FieldLead"],
      },
    ],
  },

  // 🧠 الذكاء والتحكم الآلي
  {
    key: "section_ai_and_automation",
    icon: Cpu,
    items: [
      {
        key: "campaigns",
        icon: Megaphone,
        path: "/campaigns",
        roles: ["Admin"],
      },
      {
        key: "automation",
        icon: Cpu,
        path: "/automation",
        roles: ["Admin"],
      },
      {
        key: "predictive_insights",
        icon: Layers,
        path: "/ai-insights",
        roles: ["Admin"],
      },
    ],
  },

  // ⚙️ الإدارة التقنية والأمنية
  {
    key: "section_system_admin",
    icon: Settings,
    items: [
      {
        key: "user_roles",
        icon: Users,
        path: "/settings/users",
        roles: ["Admin"],
      },
      {
        key: "system_logs",
        icon: Database,
        path: "/settings/logs",
        roles: ["Admin"],
      },
      {
        key: "security_center",
        icon: Lock,
        path: "/settings/security",
        roles: ["Admin"],
      },
      { 
        key: "integrations",
        icon: Network,
        path: "/settings/integrations",
        roles: ["Admin"],
      },
      {
        key: "system_settings",
        icon: Settings,
        path: "/settings/general",
        roles: ["Admin"],
      },
    ],
  },
];
