// src/integrations/auth/index.ts

import { importSupabaseAuth } from './supabase';
import { importLaravelAuth } from './laravel';

const backend = import.meta.env.VITE_AUTH_BACKEND;

export const auth = backend === 'supabase'
  ? importSupabaseAuth()
  : importLaravelAuth();
