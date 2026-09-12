import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hungerai/supabase";
import { requireAdmin } from "@/lib/hungerai/adminAuth";
import { validateSlugFormat, checkSlugAvailable } from "@/lib/hungerai/restaurantValidation";
import { restaurantCreateSchema } from "@/lib/hungerai/validation";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json();
    const parsed = restaurantCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid restaurant payload", details: parsed.error.flatten() },
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
        { error: "Restaurant with this slug already exists" },
        { status: 409 }
      );
    }

    const taxEnabled = !!body.tax_enabled && (body.tax_percent ?? 0) > 0;

    // Create restaurant
    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .insert({
        slug: body.slug,
        name: body.name,
        whatsapp_number: body.whatsapp_number,
        logo_url: body.logo_url || null,
        owner_email: body.owner_email || null,
        delivery_base_fee: body.delivery_base_fee ?? 50,
        delivery_fee_per_km: body.delivery_fee_per_km ?? 20,
        delivery_radius_km: body.delivery_radius_km ?? 10,
        city_lat: body.city_lat ?? 31.5204,
        city_lng: body.city_lng ?? 74.3587,
        online_payment_details: body.online_payment_details || null,
        card_on_delivery_enabled: body.card_on_delivery_enabled ?? false,
        pickup_enabled: body.pickup_enabled ?? false,
        delivery_enabled: body.delivery_enabled ?? true,
        pickup_address: body.pickup_address || null,
        is_open: body.is_open ?? true,
        tax_enabled: taxEnabled,
        tax_cod_percent: taxEnabled ? body.tax_percent : 0,
        tax_online_percent: taxEnabled ? body.tax_percent : 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Restaurant insert error:", error);
      return NextResponse.json(
        { error: "Failed to create restaurant" },
        { status: 500 }
      );
    }

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Restaurants API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminSupabaseClient();

    const { data: restaurants, error } = await supabase
      .from("restaurants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Restaurants fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch restaurants" },
        { status: 500 }
      );
    }

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Restaurants API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
