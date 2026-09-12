import type { SupabaseClient } from "@supabase/supabase-js";

const SLUG_REGEX = /^[a-z0-9-]+$/;

export function validateSlugFormat(slug: string): string | null {
  if (!slug || !SLUG_REGEX.test(slug)) {
    return "Slug must be lowercase alphanumeric with hyphens only";
  }
  return null;
}

export async function checkSlugAvailable(
  supabase: SupabaseClient,
  slug: string
): Promise<boolean> {
  const { data } = await supabase
    .from("restaurants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  return !data;
}
