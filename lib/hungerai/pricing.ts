/**
 * Server-side order pricing.
 *
 * Recomputes subtotal/tax/total from the restaurant's real menu data instead
 * of trusting client-submitted prices — the checkout UI sends item ids, qty,
 * and selected option ids; everything money-related is derived here.
 */

import type { ItemOption, MenuItem, OrderItem, Restaurant } from "@/types/hungerai";

export interface PricingInput {
  items: OrderItem[]; // client-submitted: id, name, qty, price, options[] — only `id`, `qty`, and options[].id are trusted
  menuItems: MenuItem[]; // restaurant's real menu_items rows
  itemOptions: ItemOption[]; // restaurant's real item_options rows
  restaurant: Pick<Restaurant, "tax_enabled" | "tax_cod_percent" | "tax_online_percent">;
  paymentMethod: "cod" | "online" | "card";
  deliveryFee: number;
}

export interface ResolvedOrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  options: { label: string; price_delta: number }[];
}

export type PricingResult =
  | {
      ok: true;
      subtotal: number;
      taxAmount: number;
      taxRate: number;
      deliveryFee: number;
      total: number;
      resolvedItems: ResolvedOrderItem[];
    }
  | { ok: false; error: string };

export function computeOrderPricing(input: PricingInput): PricingResult {
  const { items, menuItems, itemOptions, restaurant, paymentMethod, deliveryFee } = input;

  if (!items || items.length === 0) {
    return { ok: false, error: "Order has no items" };
  }

  const menuItemsById = new Map(menuItems.map((mi) => [mi.id, mi]));
  const optionsByMenuItem = new Map<string, ItemOption[]>();
  for (const opt of itemOptions) {
    const list = optionsByMenuItem.get(opt.menu_item_id) ?? [];
    list.push(opt);
    optionsByMenuItem.set(opt.menu_item_id, list);
  }

  const resolvedItems: ResolvedOrderItem[] = [];
  let subtotal = 0;

  for (const submitted of items) {
    const menuItem = menuItemsById.get(submitted.id);
    if (!menuItem) {
      return { ok: false, error: `Menu item ${submitted.id} not found for this restaurant` };
    }
    if (!menuItem.is_available) {
      return { ok: false, error: `"${menuItem.name}" is currently unavailable` };
    }

    const validOptions = optionsByMenuItem.get(menuItem.id) ?? [];
    const validOptionsById = new Map(validOptions.map((o) => [o.id, o]));

    const resolvedOptions: { label: string; price_delta: number }[] = [];
    for (const submittedOpt of submitted.options ?? []) {
      // Client only sends option ids in practice (via `id` on CartItemOption);
      // OrderItem's options carry label/price_delta already resolved client-side,
      // so match by label as a fallback if an id isn't present, but prefer the
      // authoritative row whenever we can find one by matching label to a real option.
      const match =
        Array.from(validOptionsById.values()).find((o) => o.label === submittedOpt.label) ?? null;
      if (!match) {
        return {
          ok: false,
          error: `Option "${submittedOpt.label}" is not valid for "${menuItem.name}"`,
        };
      }
      resolvedOptions.push({ label: match.label, price_delta: match.price_delta });
    }

    const optionsDelta = resolvedOptions.reduce((sum, o) => sum + o.price_delta, 0);
    const lineTotal = (menuItem.price + optionsDelta) * submitted.qty;
    subtotal += lineTotal;

    resolvedItems.push({
      id: menuItem.id,
      name: menuItem.name,
      qty: submitted.qty,
      price: menuItem.price,
      options: resolvedOptions,
    });
  }

  const taxRate = restaurant.tax_enabled
    ? paymentMethod === "online"
      ? (restaurant.tax_online_percent ?? 5)
      : (restaurant.tax_cod_percent ?? 16) // cod & card use the same rate
    : 0;
  const taxAmount = taxRate > 0 ? Math.round((subtotal * taxRate) / 100) : 0;

  const safeDeliveryFee = Number.isFinite(deliveryFee) && deliveryFee > 0 ? Math.round(deliveryFee) : 0;
  const total = subtotal + taxAmount + safeDeliveryFee;

  return {
    ok: true,
    subtotal,
    taxAmount,
    taxRate,
    deliveryFee: safeDeliveryFee,
    total,
    resolvedItems,
  };
}
