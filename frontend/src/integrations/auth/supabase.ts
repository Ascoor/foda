// src/integrations/auth/supabase.ts
import { supabase } from "@/integrations/supabase/client";
import type { AuthInterface } from "./types";

export function importSupabaseAuth(): AuthInterface {
  return {
    async login({ email, password }) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async logout() {
      await supabase.auth.signOut();
    },
    async register(data) {
      const { error } = await supabase.auth.signUp(data);
      if (error) throw error;
    },
    async refresh() {
      await supabase.auth.getSession();
    }
  };
}
