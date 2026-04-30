import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient, createSimpleServerClient } from "@/lib/hungerai/supabase";
import { sendOrderEmail } from "@/lib/hungerai/email";
import type { OrderPayload, Restaurant } from "@/types/hungerai";

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

    // Use admin client for inserting orders (bypasses RLS for public order creation)
    const supabase = createAdminSupabaseClient();

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
        total: body.total,
        delivery_lat: body.delivery_lat,
        delivery_lng: body.delivery_lng,
        delivery_address: body.delivery_address,
        payment_method: body.payment_method,
        wa_sent: true, // Set to true since we're redirecting to WhatsApp
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
