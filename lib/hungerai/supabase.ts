import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Browser client for client components
 * Use this in components with "use client" directive
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Server client for server components and route handlers
 * Use this in Server Components, Server Actions, and Route Handlers
 */
export function createServerSupabaseClient(): SupabaseClient {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
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
