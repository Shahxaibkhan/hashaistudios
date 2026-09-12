import type { OrderType } from "@/types/hungerai";

// Single source of truth for how each order type is labeled/iconified —
// used by the checkout toggle, the dashboard order card, and the QR posters.
export const ORDER_TYPE_META: Record<OrderType, { emoji: string; label: string }> = {
  delivery: { emoji: "🛵", label: "Delivery" },
  pickup: { emoji: "🏃", label: "Pickup" },
  curbside: { emoji: "🚗", label: "Curbside" },
  dine_in: { emoji: "🍽️", label: "Dine In" },
};
