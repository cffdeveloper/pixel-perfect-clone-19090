import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Server-side Supabase client using the **anon/publishable** key.
 * RLS policies apply — only published data is visible.
 * Use this for all public (unauthenticated) server function reads/writes.
 */
function createSupabaseAnonServer() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
      ...(!SUPABASE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(`Missing env: ${missing.join(", ")}`);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let _instance: ReturnType<typeof createSupabaseAnonServer> | undefined;

export const supabaseAnonServer = new Proxy(
  {} as ReturnType<typeof createSupabaseAnonServer>,
  {
    get(_, prop, receiver) {
      if (!_instance) _instance = createSupabaseAnonServer();
      return Reflect.get(_instance, prop, receiver);
    },
  },
);
