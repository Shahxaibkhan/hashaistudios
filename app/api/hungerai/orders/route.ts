import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hungerai/supabase";
import { sendOrderEmail } from "@/lib/hungerai/email";
import { computeOrderPricing } from "@/lib/hungerai/pricing";
import { orderPayloadSchema } from "@/lib/hungerai/validation";
import type { Restaurant } from "@/types/hungerai";

// Rate limit: max 5 orders per IP per 10 minutes
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MINUTES = 10;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsed = orderPayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const body = parsed.data;

    // Get client IP
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Orders always use the admin (service-role) client — pricing needs
    // private restaurant fields (is_open, tax config) regardless of RLS.
    const supabase = createAdminSupabaseClient();

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

    // Fetch restaurant — required to recompute pricing and to check is_open
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", body.restaurant_id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    if (!(restaurant as Restaurant).is_open) {
      return NextResponse.json(
        { error: "Restaurant is currently closed" },
        { status: 409 }
      );
    }

    // Fetch the restaurant's real menu to recompute pricing server-side —
    // never trust client-submitted prices/names.
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", body.restaurant_id);

    const menuItemIds = (menuItems ?? []).map((mi) => mi.id);
    const { data: itemOptions } = await supabase
      .from("item_options")
      .select("*")
      .in("menu_item_id", menuItemIds.length > 0 ? menuItemIds : ["none"]);

    const pricing = computeOrderPricing({
      items: body.items,
      menuItems: menuItems ?? [],
      itemOptions: itemOptions ?? [],
      restaurant: restaurant as Restaurant,
      paymentMethod: body.payment_method,
      deliveryFee: body.order_type !== "delivery" ? 0 : body.delivery_fee,
    });

    if (!pricing.ok) {
      return NextResponse.json({ error: pricing.error }, { status: 400 });
    }

    // Insert order using server-recomputed pricing + resolved item snapshot
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id: body.restaurant_id,
        customer_name: body.customer_name,
        customer_whatsapp: body.customer_whatsapp,
        items: pricing.resolvedItems as any, // JSONB
        subtotal: pricing.subtotal,
        delivery_fee: pricing.deliveryFee,
        ...(pricing.taxAmount > 0 && { tax_amount: pricing.taxAmount }),
        total: pricing.total,
        delivery_lat: body.delivery_lat ?? null,
        delivery_lng: body.delivery_lng ?? null,
        delivery_address: body.delivery_address,
        payment_method: body.payment_method,
        order_type: body.order_type,
        car_plate_number: body.car_plate_number || null,
        car_color: body.car_color || null,
        table_number: body.table_number || null,
        wa_sent: true,
        ...(clientIp !== "unknown" && { client_ip: clientIp }),
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Send backup email (non-blocking)
    if ((restaurant as Restaurant).owner_email) {
      sendOrderEmail({
        orderNumber: order.order_number,
        restaurantName: (restaurant as Restaurant).name,
        ownerEmail: (restaurant as Restaurant).owner_email!,
        customerName: body.customer_name,
        customerWhatsApp: body.customer_whatsapp,
        items: pricing.resolvedItems,
        subtotal: pricing.subtotal,
        deliveryFee: pricing.deliveryFee,
        total: pricing.total,
        deliveryLat: body.delivery_lat ?? null,
        deliveryLng: body.delivery_lng ?? null,
        paymentMethod: body.payment_method,
      }).catch((err) => {
        console.error("Email send error:", err);
      });
    }

    return NextResponse.json({
      order_number: order.order_number,
      id: order.id,
      subtotal: pricing.subtotal,
      tax_amount: pricing.taxAmount,
      tax_rate: pricing.taxRate,
      delivery_fee: pricing.deliveryFee,
      total: pricing.total,
      items: pricing.resolvedItems,
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
