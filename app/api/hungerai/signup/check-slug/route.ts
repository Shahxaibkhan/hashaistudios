import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hungerai/supabase";
import { validateSlugFormat, checkSlugAvailable } from "@/lib/hungerai/restaurantValidation";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || "";

  const formatError = validateSlugFormat(slug);
  if (formatError) {
    return NextResponse.json({ available: false, error: formatError });
  }

  const supabase = createAdminSupabaseClient();
  const available = await checkSlugAvailable(supabase, slug);
  return NextResponse.json({ available });
}
