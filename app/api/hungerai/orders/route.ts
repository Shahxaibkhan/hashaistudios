import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, createSimpleServerClient } from "@/lib/hungerai/supabase";
import { sendOrderEmail } from "@/lib/hungerai/email";
import type { OrderPayload, Restaurant } from "@/types/hungerai";

// Rate limit: max 5 orders per IP per 10 minutes
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MINUTES = 10;

export async function POST(request: NextRequest) {
  try {
    const body: OrderPayload = await request.json();

    // Validate required fields
    if (
      !body.restaurant_id ||
      !body.customer_name ||
      !body.customer_whatsapp ||
      !body.items ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get client IP
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Use admin client if available, otherwise fall back to simple client (relies on RLS policy)
    let supabase;
    try {
      supabase = createAdminSupabaseClient();
    } catch {
      supabase = createSimpleServerClient();
    }

    // Rate limiting: check recent orders from this IP
    if (clientIp !== "unknown") {
      try {
        const windowStart = new Date(
          Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
        ).toISOString();
        const { count } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("client_ip", clientIp)
          .gte("created_at", windowStart);

        if ((count ?? 0) >= RATE_LIMIT_MAX) {
          return NextResponse.json(
            { error: "Too many orders. Please wait a few minutes before trying again." },
            { status: 429 }
          );
        }
      } catch {
        // Rate limit check failed (e.g. column missing) - allow order to proceed
      }
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id: body.restaurant_id,
        customer_name: body.customer_name,
        customer_whatsapp: body.customer_whatsapp,
        items: body.items as any, // JSONB
        subtotal: body.subtotal,
        delivery_fee: body.delivery_fee,
        ...(body.tax_amount !== undefined && { tax_amount: body.tax_amount }),
        total: body.total,
        delivery_lat: body.delivery_lat,
        delivery_lng: body.delivery_lng,
        delivery_address: body.delivery_address,
        payment_method: body.payment_method,
        wa_sent: true,
        ...(clientIp !== "unknown" && { client_ip: clientIp }),
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order", detail: orderError?.message, hint: orderError?.hint },
        { status: 500 }
      );
    }

    // Fetch restaurant for email
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", body.restaurant_id)
      .single();

    // Send backup email (non-blocking)
    if (restaurant?.owner_email) {
      sendOrderEmail({
        orderNumber: order.order_number,
        restaurantName: (restaurant as Restaurant).name,
        ownerEmail: (restaurant as Restaurant).owner_email!,
        customerName: body.customer_name,
        customerWhatsApp: body.customer_whatsapp,
        items: body.items,
        subtotal: body.subtotal,
        deliveryFee: body.delivery_fee,
        total: body.total,
        deliveryLat: body.delivery_lat,
        deliveryLng: body.delivery_lng,
        paymentMethod: body.payment_method,
      }).catch((err) => {
        console.error("Email send error:", err);
      });
    }

    return NextResponse.json({
      order_number: order.order_number,
      id: order.id,
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint requires authentication
    // For now, return method not allowed
    // TODO: Implement auth check for dashboard
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
