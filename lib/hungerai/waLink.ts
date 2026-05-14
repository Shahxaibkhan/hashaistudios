/**
 * WhatsApp Link Builder for HungerAI
 *
 * Builds the complete wa.me URL with a structured, readable order message.
 * The message is URL-encoded for WhatsApp deep linking.
 *
 * CRITICAL: Line breaks must use %0A (encoded newline), not \n
 * Bold text in WhatsApp uses *text*
 */

import type { OrderItem } from "@/types/hungerai";

export interface WaLinkParams {
  orderNumber: number;
  restaurantWhatsApp: string; // e.g., "923001234567"
  items: OrderItem[];
  customerName: string;
  customerWhatsApp: string; // e.g., "923001234567"
  deliveryLat: number | null;
  deliveryLng: number | null;
  deliveryAddress: string;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  paymentMethod: "cod" | "online" | "card";
  receiptUrl?: string; // Optional link to the order receipt page
}

/**
 * Format a phone number for display (e.g., "0300-1234567")
 */
export function formatPhoneForDisplay(phone: string): string {
  // Remove any non-digits
  const digits = phone.replace(/\D/g, "");

  // Handle Pakistani numbers (starting with 92)
  if (digits.startsWith("92") && digits.length === 12) {
    // 923001234567 → 0300-1234567
    const local = digits.slice(2); // Remove "92"
    return `0${local.slice(0, 3)}-${local.slice(3)}`;
  }

  // Handle already local format (starting with 0)
  if (digits.startsWith("0") && digits.length === 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  // Return as-is if unknown format
  return phone;
}

/**
 * Format price in PKR (e.g., "Rs 550")
 */
export function formatPrice(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

/**
 * Build a single item line for the order message
 */
function formatItemLine(item: OrderItem): string {
  const itemTotal = (item.price + item.options.reduce((sum, o) => sum + o.price_delta, 0)) * item.qty;
  let line = `${item.qty}x ${item.name} — ${formatPrice(itemTotal)}`;

  // Add options as indented lines
  if (item.options.length > 0) {
    const optionLines = item.options.map((opt) => `   + ${opt.label}`);
    line += "\n" + optionLines.join("\n");
  }

  return line;
}

/**
 * Build the complete order message (before encoding)
 */
export function buildOrderMessage(params: WaLinkParams): string {
  const {
    orderNumber,
    items,
    customerName,
    customerWhatsApp,
    deliveryLat,
    deliveryLng,
    deliveryAddress,
    subtotal,
    taxAmount,
    taxRate,
    total,
    paymentMethod,
    receiptUrl,
  } = params;

  const itemLines = items.map(formatItemLine).join("\n");

  const paymentDisplay =
    paymentMethod === "cod" ? "COD" : paymentMethod === "card" ? "Card on Delivery" : "Online";

  // Build Google Maps link
  const mapsLink =
    deliveryLat && deliveryLng
      ? `https://maps.google.com/?q=${deliveryLat},${deliveryLng}`
      : null;

  const line = "━━━━━━━━━━━━━━━━";

  const message = `${line}
🍔 *ORDER #${orderNumber}*
${line}

${itemLines}

${line}
💰 ${formatPrice(subtotal)}${taxAmount > 0 ? ` + ${taxRate}% tax (Rs ${taxAmount})` : ""} · ${paymentDisplay}
${line}

👤 ${customerName}
📱 ${formatPhoneForDisplay(customerWhatsApp)}

📍 ${deliveryAddress || "Not provided"}
${mapsLink ? mapsLink : ""}
${line}${receiptUrl ? `\n🧾 View receipt: ${receiptUrl}` : ""}`;

  return message;
}

/**
 * Build the complete wa.me URL with encoded order message
 *
 * @returns Full wa.me URL ready for window.location.href
 */
export function buildWaLink(params: WaLinkParams): string {
  const message = buildOrderMessage(params);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${params.restaurantWhatsApp}?text=${encodedMessage}`;
}

/**
 * Calculate order totals from items
 */
export function calculateOrderTotals(
  items: OrderItem[],
  deliveryFee: number
): {
  subtotal: number;
  deliveryFee: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice =
      item.price + item.options.reduce((optSum, o) => optSum + o.price_delta, 0);
    return sum + itemPrice * item.qty;
  }, 0);

  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
}
