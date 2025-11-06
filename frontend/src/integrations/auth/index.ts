// src/integrations/auth/index.ts

import { importSupabaseAuth } from './supabase';
import { importLaravelAuth } from './laravel';
import type { AuthInterface } from './types';

const rawBackend = (import.meta.env.VITE_AUTH_BACKEND ?? 'supabase').toString();
const normalizedBackend = rawBackend.trim().toLowerCase();

const LARAVEL_BACKENDS = new Set([
  'laravel',
  'local',
  'localhost',
  'sanctum',
  'backend',
  'api',
]);

export const AUTH_BACKEND = LARAVEL_BACKENDS.has(normalizedBackend)
  ? 'laravel'
  : 'supabase';

export const auth: AuthInterface =
  AUTH_BACKEND === 'supabase' ? importSupabaseAuth() : importLaravelAuth();
