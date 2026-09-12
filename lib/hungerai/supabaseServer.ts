import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Server-side client that reads the caller's session from cookies.
 * Use in Server Components and Route Handlers that need to know WHO is
 * calling (e.g. `auth.getUser()`) rather than just reading public data.
 *
 * Kept in its own file (mirrors lib/carpect/supabase.ts) because it imports
 * `next/headers`, which can never be bundled into a client component —
 * `./supabase.ts` is imported by many "use client" files, so this must not
 * live there.
 */
export function createServerSupabaseClient(): SupabaseClient {
  const cookieStore = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, opts) => {
        try {
          cookieStore.set({ name, value, ...opts });
        } catch {
          // called from a Server Component render — safe to ignore
        }
      },
      remove: (name, opts) => {
        try {
          cookieStore.set({ name, value: "", ...opts });
        } catch {
          // called from a Server Component render — safe to ignore
        }
      },
    },
  });
}
