import { LayoutDashboard, Megaphone, Users, MessageSquare, UserPlus, MapPin, Calendar, Vote, BarChart3, Wallet, Settings, FileText, Database, History, User } from 'lucide-react';
import type React from 'react';

export interface SidebarChild {
  key: string;
  label: string;
  path: string;
  icon: React.ElementType;
  glow?: string;
}

export interface SidebarItem {
  key: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  badge?: number | null;
  color?: string;
  glow?: string;
  children?: SidebarChild[];
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const sidebarSections: SidebarSection[] = [
  {
    title: 'Main',
    items: [
      { key: 'dashboard', label: 'nav.dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'text-blue-500' },
    ],
  },
  {
    title: 'Campaigns',
    items: [
      {
        key: 'campaigns',
        label: 'nav.campaigns',
        icon: Megaphone,
        color: 'text-orange-500',
        children: [
          { key: 'campaigns.overview', label: 'Campaigns', path: '/campaigns', icon: Megaphone },
          { key: 'campaigns.reports', label: 'campaigns.reports', path: '/campaigns/reports', icon: FileText },
        ],
      },
    ],
  },
  {
    title: 'Teams & People',
    items: [
      {
        key: 'teams',
        label: 'nav.teams',
        icon: Users,
        color: 'text-purple-500',
        children: [
          { key: 'teams.overview', label: 'Teams', path: '/teams', icon: Users },
          { key: 'teams.members', label: 'Team Members', path: '/teams/members', icon: Users },
        ],
      },
      {
        key: 'sms',
        label: 'nav.sms',
        icon: MessageSquare,
        color: 'text-green-500',
        children: [
          { key: 'sms.overview', label: 'SMS', path: '/sms', icon: MessageSquare },
          { key: 'sms.settings', label: 'SMS Settings', path: '/sms/settings', icon: Settings },
          { key: 'sms.history', label: 'SMS History', path: '/sms/history', icon: History },
        ],
      },
      { key: 'volunteers', label: 'nav.volunteers', icon: UserPlus, path: '/volunteers', color: 'text-teal-500' },
      { key: 'voters', label: 'nav.voters', icon: Vote, path: '/voters', color: 'text-red-500' },
    ],
  },
  {
    title: 'Data & Management',
    items: [
      { key: 'elections', label: 'nav.elections', icon: Vote, path: '/elections', color: 'text-red-500' },
      { key: 'areas', label: 'nav.areas', icon: MapPin, path: '/areas', color: 'text-yellow-500' },
      { key: 'events', label: 'nav.events', icon: Calendar, path: '/events', color: 'text-pink-500' },
      { key: 'analytics', label: 'nav.analytics', icon: BarChart3, path: '/analytics', color: 'text-blue-500' },
      {
        key: 'finance',
        label: 'nav.finance',
        icon: Wallet,
        color: 'text-green-600',
        glow: 'neon-glow-green',
        children: [
          { key: 'finance.overview', label: 'Finance', path: '/finance', icon: Wallet, glow: 'neon-glow-green' },
          { key: 'finance.categories', label: 'Expense Categories', path: '/finance/categories', icon: Database, glow: 'neon-glow-green' },
          { key: 'finance.report', label: 'Financial Report', path: '/finance/report', icon: FileText, glow: 'neon-glow-green' },
        ],
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      // Settings module link
      { key: 'settings', label: 'nav.settings', icon: Settings, path: '/settings', color: 'text-gray-500' },
      { key: 'profile', label: 'nav.profile', icon: User, path: '/profile', color: 'text-gray-500' },
    ],
  },
];
