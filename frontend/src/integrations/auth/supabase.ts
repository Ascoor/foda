// src/integrations/auth/supabase.ts
import { supabase } from "@/integrations/supabase/client";
import type { AuthInterface, AuthResult, RegisterPayload } from "./types";

export function importSupabaseAuth(): AuthInterface {
  return {
    async login({ email, password }) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      return {
        user: data.user ?? undefined,
        session: data.session ?? undefined,
      } satisfies AuthResult;
    },
    async logout() {
      await supabase.auth.signOut();
    },
    async register(data) {
      const { email, password } = data as RegisterPayload & {
        email: string;
        password: string;
        name?: string;
      };

      const redirectUrl =
        typeof window !== "undefined" ? `${window.location.origin}/` : undefined;

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            ...(typeof (data as { name?: string }).name === "string"
              ? { full_name: (data as { name?: string }).name }
              : {}),
          },
        },
      });

      if (error) throw error;

      return {
        user: authData.user ?? undefined,
        session: authData.session ?? undefined,
      } satisfies AuthResult;
    },
    async refresh() {
      const { data } = await supabase.auth.getSession();
      return {
        user: data.session?.user ?? undefined,
        session: data.session ?? undefined,
      } satisfies AuthResult;
    },
  };
}
