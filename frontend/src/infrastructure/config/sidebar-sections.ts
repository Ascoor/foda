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
  Cpu,
  BarChart3,
  Settings,
} from "lucide-react";

export type SidebarItem = {
  key: string;
  icon: LucideIcon;
  path: string;
};

export type SidebarSection = {
  key: string;
  icon?: LucideIcon;
  path?: string;
  items?: SidebarItem[];
};

export const sidebarSections: SidebarSection[] = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    key: "section_election_operations",
    items: [
      {
        key: "elections",
        icon: Vote,
        path: "/elections",
      },
      {
        key: "geo_areas",
        icon: MapPin,
        path: "/geo-areas",
      },
      {
        key: "zones_mansoura",
        icon: MapPin,
        path: "/zones/mansoura",
      },
      {
        key: "committees",
        icon: Users,
        path: "/committees",
      },
      {
        key: "voters",
        icon: UserCheck,
        path: "/voters",
      },
      {
        key: "candidates",
        icon: Crown,
        path: "/candidates",
      },
    ],
  },
  {
    key: "section_field_resources",
    items: [
      {
        key: "agents",
        icon: Shield,
        path: "/agents",
      },
      {
        key: "volunteers",
        icon: Heart,
        path: "/volunteers",
      },
      {
        key: "observations",
        icon: Eye,
        path: "/observations",
      },
    ],
  },
  {
    key: "section_campaign_intelligence",
    items: [
      {
        key: "campaigns",
        icon: Megaphone,
        path: "/campaigns",
      },
      {
        key: "automation",
        icon: Cpu,
        path: "/automation",
      },
      {
        key: "analytics",
        icon: BarChart3,
        path: "/analytics",
      },
    ],
  },
  {
    key: "section_admin",
    items: [
      {
        key: "settings",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];
