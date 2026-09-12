import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Browser client for client components
 * Use this in components with "use client" directive
 *
 * NOTE: this file must stay free of server-only imports (e.g. `next/headers`)
 * — it's imported directly by many "use client" components (HungerAI and
 * CarPect alike), and bundling `next/headers` into a client component breaks
 * the build. The cookie-aware server client lives in `./supabaseServer`
 * instead, in its own file, imported only from Server Components/Route
 * Handlers.
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Admin client with service role key
 * Use this only in secure server-side contexts (API routes, server actions)
 * Has full access to all data, bypasses RLS
 */
export function createAdminSupabaseClient(): SupabaseClient {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Simple server client for read-only operations
 * Does not require cookie handling
 */
export function createSimpleServerClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}
