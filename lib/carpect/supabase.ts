import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Server-side Supabase client for CarPect.
 * Reads the user's session from cookies — use in Server Components and Route Handlers.
 */
export function createCarpectServerClient() {
  const cookieStore = cookies()
  return createServerClient(url, anon, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, opts) => { try { cookieStore.set({ name, value, ...opts }) } catch {} },
      remove: (name, opts) => { try { cookieStore.set({ name, value: '', ...opts }) } catch {} },
    },
  })
}

/**
 * Admin client — bypasses RLS. Use only in trusted API routes.
 */
export function createCarpectAdminClient() {
  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
