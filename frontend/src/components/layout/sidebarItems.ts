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
  relatedKeys?: string[];
}

export interface SidebarSectionConfig {
  key: string;
  items: SidebarItemConfig[];
  roles?: string[];
}

export const sidebarSections: SidebarSectionConfig[] = [
  {
    key: 'section_overview',
    items: [{ key: 'dashboard', icon: LayoutDashboard, path: '/dashboard' }],
  },
  {
    key: 'section_election_operations',
    items: [
      {
        key: 'elections',
        icon: Vote,
        path: '/elections',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['geo_areas', 'committees', 'voters', 'candidates', 'zones_mansoura'],
      },
      {
        key: 'geo_areas',
        icon: MapPin,
        path: '/geo-areas',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['elections', 'zones_mansoura'],
      },
      {
        key: 'zones_mansoura',
        icon: MapPin,
        path: '/zones/mansoura',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['geo_areas', 'committees'],
      },
      {
        key: 'committees',
        icon: Users,
        path: '/committees',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['elections', 'voters'],
      },
      {
        key: 'voters',
        icon: UserCheck,
        path: '/voters',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['committees', 'candidates'],
      },
      {
        key: 'candidates',
        icon: Crown,
        path: '/candidates',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['voters', 'elections'],
      },
    ],
  },
  {
    key: 'section_field_resources',
    items: [
      {
        key: 'agents',
        icon: Shield,
        path: '/agents',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['volunteers', 'observations'],
      },
      {
        key: 'volunteers',
        icon: Heart,
        path: '/volunteers',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['agents', 'observations'],
      },
      {
        key: 'observations',
        icon: Eye,
        path: '/observations',
        roles: ['Admin', 'FieldLead', 'Agent'],
        relatedKeys: ['agents', 'volunteers'],
      },
    ],
  },
  {
    key: 'section_campaign_intelligence',
    items: [
      {
        key: 'campaigns',
        icon: Megaphone,
        path: '/campaigns',
        roles: ['Admin', 'FieldLead'],
        relatedKeys: ['automation', 'analytics'],
      },
      {
        key: 'automation',
        icon: Cpu,
        path: '/automation',
        roles: ['Admin'],
        relatedKeys: ['campaigns', 'analytics'],
      },
      {
        key: 'analytics',
        icon: BarChart3,
        path: '/analytics',
        roles: ['Admin'],
        relatedKeys: ['campaigns'],
      },
    ],
  },
  {
    key: 'section_admin',
    items: [
      {
        key: 'settings',
        icon: Settings,
        path: '/settings',
        roles: ['Admin'],
      },
    ],
  },
];
