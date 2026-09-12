import { createServerSupabaseClient } from "@/lib/hungerai/supabaseServer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/**
 * Verifies the caller's Supabase session (via cookies) belongs to the
 * platform admin. Always re-validates the token against Supabase — never
 * trust a client-supplied header/email for this check.
 */
export async function requireAdmin(): Promise<{ email: string } | null> {
  if (!ADMIN_EMAIL) return null;

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || user.email !== ADMIN_EMAIL) return null;

  return { email: user.email };
}
