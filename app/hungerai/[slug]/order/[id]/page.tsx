import { notFound } from "next/navigation";
import { createAdminSupabaseClient, createSimpleServerClient } from "@/lib/hungerai/supabase";
import type { OrderItem, Restaurant } from "@/types/hungerai";
import { formatPhoneForDisplay, formatPrice } from "@/lib/hungerai/waLink";

interface ReceiptPageProps {
  params: { slug: string; id: string };
}

export default async function OrderReceiptPage({ params }: ReceiptPageProps) {
  const { slug, id } = params;

  let supabase;
  try {
    supabase = createAdminSupabaseClient();
  } catch {
    supabase = createSimpleServerClient();
  }

  // Fetch order + restaurant in parallel
  const [{ data: order }, { data: restaurant }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("restaurants")
      .select("id, name, logo_url, slug, city_lat, city_lng, pickup_address")
      .eq("slug", slug)
      .single(),
  ]);

  if (!order || !restaurant || order.restaurant_id !== restaurant.id) {
    notFound();
  }

  const items: OrderItem[] = order.items as OrderItem[];
  const mapsLink =
    order.delivery_lat && order.delivery_lng
      ? `https://maps.google.com/?q=${order.delivery_lat},${order.delivery_lng}`
      : null;

  const paymentLabel =
    order.payment_method === "cod" ? "Cash on Delivery" :
    order.payment_method === "card" ? "Card on Delivery" : "Online Payment";

  const isPickup = (order as any).order_type === "pickup";

  const orderedAt = new Date(order.created_at).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-[var(--hai-bg-secondary)] flex flex-col items-center py-8 px-4">
      {/* Receipt Card */}
      <div className="w-full max-w-md bg-[var(--hai-bg-primary)] rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--hai-accent-primary)] px-6 py-5 text-white text-center">
          <p className="text-sm font-medium opacity-80 mb-1">{(restaurant as any).name}</p>
          <h1 className="font-display text-2xl font-bold">Order #{order.order_number}</h1>
          <p className="text-sm opacity-70 mt-1">{orderedAt}</p>
        </div>

        {/* Items */}
        <div className="px-6 py-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--hai-text-muted)] mb-3">
            Items
          </h2>
          <div className="space-y-3">
            {items.map((item, i) => {
              const optionsDelta = item.options.reduce(
                (sum, o) => sum + o.price_delta,
                0
              );
              const lineTotal = (item.price + optionsDelta) * item.qty;
              return (
                <div key={i} className="flex justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--hai-text-primary)] font-medium text-sm leading-tight">
                      {item.qty}× {item.name}
                    </p>
                    {item.options.length > 0 && (
                      <p className="text-[var(--hai-text-muted)] text-xs mt-0.5">
                        {item.options.map((o) => o.label).join(", ")}
                      </p>
                    )}
                  </div>
                  <p className="text-[var(--hai-text-primary)] text-sm font-medium shrink-0">
                    {formatPrice(lineTotal)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-[var(--hai-border-subtle)] mx-6" />

        {/* Totals */}
        <div className="px-6 py-4 space-y-2 text-sm">
          <div className="flex justify-between text-[var(--hai-text-secondary)]">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {(order as any).tax_amount > 0 && (
            <div className="flex justify-between text-[var(--hai-text-secondary)]">
              <span>Tax</span>
              <span>{formatPrice((order as any).tax_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[var(--hai-text-secondary)]">
            <span>Delivery Fee</span>
            <span className="text-[var(--hai-text-muted)]">To be confirmed</span>
          </div>
          <div className="flex justify-between font-bold text-[var(--hai-text-primary)] text-base pt-1 border-t border-[var(--hai-border-subtle)]">
            <span>Total</span>
            <span>{formatPrice(order.total)}+</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-[var(--hai-border-subtle)] mx-6" />

        {/* Customer & Delivery */}
        <div className="px-6 py-4 space-y-2 text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--hai-text-muted)] mb-3">
            Customer
          </h2>
          <div className="flex items-center gap-2 text-[var(--hai-text-primary)]">
            <span>👤</span>
            <span>{order.customer_name}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--hai-text-primary)]">
            <span>📱</span>
            <span>{formatPhoneForDisplay(order.customer_whatsapp)}</span>
          </div>

          {/* Pickup info */}
          {isPickup && (
            <div className="mt-3 pt-3 border-t border-[var(--hai-border-subtle)] space-y-2">
              <div className="flex items-center gap-2">
                <span>🏃</span>
                <span className="font-semibold text-[var(--hai-text-primary)]">Pickup · Est. 30–40 min</span>
              </div>
              {(restaurant as any).pickup_address && (
                <div className="flex items-start gap-2 text-[var(--hai-text-primary)]">
                  <span>📍</span>
                  <span>{(restaurant as any).pickup_address}</span>
                </div>
              )}
              {(restaurant as any).city_lat && (
                <a
                  href={`https://maps.google.com/?q=${(restaurant as any).city_lat},${(restaurant as any).city_lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--hai-accent-primary)] text-xs font-medium hover:underline"
                >
                  🗺️ View pickup location on Maps
                </a>
              )}
            </div>
          )}

          {/* Delivery info */}
          {!isPickup && order.delivery_address && (
            <div className="flex items-start gap-2 text-[var(--hai-text-primary)]">
              <span>📍</span>
              <span>{order.delivery_address}</span>
            </div>
          )}
          {!isPickup && mapsLink && (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--hai-accent-primary)] text-xs font-medium mt-1 hover:underline"
            >
              🗺️ View on Google Maps
            </a>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-[var(--hai-border-subtle)] mx-6" />

        {/* Payment */}
        <div className="px-6 py-4 flex justify-between items-center text-sm">
          <span className="text-[var(--hai-text-muted)]">Payment</span>
          <span className="font-semibold text-[var(--hai-text-primary)]">
            {paymentLabel}
          </span>
        </div>

        {/* Footer */}
        <div className="bg-[var(--hai-bg-secondary)] px-6 py-4 text-center">
          <p className="text-xs text-[var(--hai-text-muted)]">
            Powered by{" "}
            <span className="font-semibold text-[var(--hai-accent-primary)]">
              HungerAI
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
