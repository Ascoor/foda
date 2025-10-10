import type { LucideIcon } from 'lucide-react';
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
} from 'lucide-react';

export interface SidebarItemConfig {
  key: string;
  icon: LucideIcon;
  path: string;
  roles?: string[];
}

export const sidebarItems: SidebarItemConfig[] = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'elections', icon: Vote, path: '/elections', roles: ['Admin', 'FieldLead'] },
  { key: 'geo_areas', icon: MapPin, path: '/geo-areas', roles: ['Admin', 'FieldLead'] },
  { key: 'committees', icon: Users, path: '/committees', roles: ['Admin', 'FieldLead'] },
  { key: 'voters', icon: UserCheck, path: '/voters', roles: ['Admin', 'FieldLead'] },
  { key: 'candidates', icon: Crown, path: '/candidates', roles: ['Admin', 'FieldLead'] },
  { key: 'agents', icon: Shield, path: '/agents', roles: ['Admin', 'FieldLead'] },
  { key: 'volunteers', icon: Heart, path: '/volunteers', roles: ['Admin', 'FieldLead'] },
  { key: 'observations', icon: Eye, path: '/observations', roles: ['Admin', 'FieldLead', 'Agent'] },
  { key: 'campaigns', icon: Megaphone, path: '/campaigns', roles: ['Admin', 'FieldLead'] },
  { key: 'automation', icon: Cpu, path: '/automation', roles: ['Admin'] },
  { key: 'analytics', icon: BarChart3, path: '/analytics', roles: ['Admin'] },
  { key: 'settings', icon: Settings, path: '/settings', roles: ['Admin'] },
];
