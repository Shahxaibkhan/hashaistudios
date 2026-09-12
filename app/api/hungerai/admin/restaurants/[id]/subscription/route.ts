import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hungerai/supabase";
import { requireAdmin } from "@/lib/hungerai/adminAuth";
import { subscriptionUpdateSchema } from "@/lib/hungerai/validation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const rawBody = await request.json();
    const parsed = subscriptionUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid subscription payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { subscription_status, subscription_plan, months } = parsed.data;

    const supabase = createAdminSupabaseClient();

    let subscription_expires_at: string | null = null;
    if (subscription_status === "active") {
      const { data: existing } = await supabase
        .from("restaurants")
        .select("subscription_expires_at")
        .eq("id", id)
        .single();

      const base =
        existing?.subscription_expires_at &&
        new Date(existing.subscription_expires_at) > new Date()
          ? new Date(existing.subscription_expires_at)
          : new Date();
      const newExpiry = new Date(base);
      newExpiry.setMonth(newExpiry.getMonth() + (months ?? 1));
      subscription_expires_at = newExpiry.toISOString();
    }

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .update({
        subscription_status,
        subscription_plan: subscription_status === "active" ? subscription_plan : null,
        subscription_expires_at,
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !restaurant) {
      console.error("Subscription update error:", error);
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Subscription API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
