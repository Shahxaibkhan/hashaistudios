import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hungerai/supabase";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(request: NextRequest) {
  try {
    // Simple admin check via header (in production, use proper auth)
    // For now, check for admin email in authorization header
    const authHeader = request.headers.get("authorization");

    if (!ADMIN_EMAIL || authHeader !== `Bearer ${ADMIN_EMAIL}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.slug || !body.name || !body.whatsapp_number) {
      return NextResponse.json(
        { error: "Missing required fields: slug, name, whatsapp_number" },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase, alphanumeric, hyphens only)
    if (!/^[a-z0-9-]+$/.test(body.slug)) {
      return NextResponse.json(
        { error: "Slug must be lowercase alphanumeric with hyphens only" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("restaurants")
      .select("id")
      .eq("slug", body.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Restaurant with this slug already exists" },
        { status: 409 }
      );
    }

    // Create restaurant
    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .insert({
        slug: body.slug,
        name: body.name,
        whatsapp_number: body.whatsapp_number,
        logo_url: body.logo_url || null,
        owner_email: body.owner_email || null,
        delivery_base_fee: body.delivery_base_fee || 50,
        delivery_fee_per_km: body.delivery_fee_per_km || 20,
        delivery_radius_km: body.delivery_radius_km || 10,
        city_lat: body.city_lat || 31.5204,
        city_lng: body.city_lng || 74.3587,
        online_payment_details: body.online_payment_details || null,
        is_open: body.is_open ?? true,
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

export async function GET(request: NextRequest) {
  try {
    // Simple admin check
    const authHeader = request.headers.get("authorization");

    if (!ADMIN_EMAIL || authHeader !== `Bearer ${ADMIN_EMAIL}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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
