import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hungerai/supabase";
import { validateSlugFormat, checkSlugAvailable } from "@/lib/hungerai/restaurantValidation";
import { signupSchema } from "@/lib/hungerai/validation";

/**
 * Creates a restaurant row for a newly self-registered owner.
 *
 * The client calls `supabase.auth.signUp(...)` first, then posts here with
 * whatever identity Supabase handed back — an `access_token` (session ready
 * immediately) or just a `user_id` (email confirmation still pending). Either
 * way we re-verify that identity against Supabase ourselves before writing
 * anything; we never trust a client-supplied email.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsed = signupSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid signup payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const slugError = validateSlugFormat(body.slug);
    if (slugError) {
      return NextResponse.json({ error: slugError }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    if (!(await checkSlugAvailable(supabase, body.slug))) {
      return NextResponse.json(
        { error: "That link is already taken — try another" },
        { status: 409 }
      );
    }

    // Resolve + verify the caller's identity server-side.
    let verifiedUserId: string;
    let verifiedEmail: string | null;
    let emailConfirmed: boolean;

    if (body.access_token) {
      const { data, error } = await supabase.auth.getUser(body.access_token);
      if (error || !data.user) {
        return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
      }
      verifiedUserId = data.user.id;
      verifiedEmail = data.user.email ?? null;
      emailConfirmed = true;
    } else {
      const { data, error } = await supabase.auth.admin.getUserById(body.user_id!);
      if (error || !data.user) {
        return NextResponse.json({ error: "Account not found" }, { status: 401 });
      }
      verifiedUserId = data.user.id;
      verifiedEmail = data.user.email ?? null;
      emailConfirmed = !!data.user.email_confirmed_at;
    }

    // One restaurant per owner account.
    const { data: existingForOwner } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", verifiedUserId)
      .maybeSingle();
    if (existingForOwner) {
      return NextResponse.json(
        { error: "This account already has a restaurant" },
        { status: 409 }
      );
    }

    const taxEnabled = !!body.tax_enabled && (body.tax_percent ?? 0) > 0;

    const { data: restaurant, error: insertError } = await supabase
      .from("restaurants")
      .insert({
        slug: body.slug,
        name: body.restaurant_name,
        whatsapp_number: body.whatsapp_number.replace(/\D/g, ""),
        owner_id: verifiedUserId,
        owner_email: verifiedEmail,
        is_open: true,
        delivery_enabled: true,
        pickup_enabled: false,
        tax_enabled: taxEnabled,
        tax_cod_percent: taxEnabled ? body.tax_percent : 0,
        tax_online_percent: taxEnabled ? body.tax_percent : 0,
      })
      .select()
      .single();

    if (insertError || !restaurant) {
      console.error("Signup restaurant insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create restaurant" },
        { status: 500 }
      );
    }

    return NextResponse.json({ restaurant, emailConfirmed }, { status: 201 });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
