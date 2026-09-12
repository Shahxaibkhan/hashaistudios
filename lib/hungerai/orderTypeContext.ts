"use client";

/**
 * Carries "this customer scanned a curbside/table QR" from the menu page to
 * checkout. Deliberately sessionStorage (not localStorage like
 * checkoutPrefill.ts) and short-lived — unlike name/address, which a repeat
 * customer wants remembered, this context must NOT silently reapply to an
 * unrelated visit later in the same browser.
 */

const KEY = "hungerai_order_type_context";
const TTL_MS = 4 * 60 * 60 * 1000; // 4h — generous for one visit, short enough not to leak into a later one

export interface OrderTypeContext {
  slug: string;
  orderType: "curbside" | "dine_in";
  tableNumber: string; // only meaningful for dine_in
  savedAt: number;
}

export function saveOrderTypeContext(ctx: Omit<OrderTypeContext, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const data: OrderTypeContext = { ...ctx, savedAt: Date.now() };
    window.sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Private browsing / storage quota — skip silently, not critical
  }
}

export function loadOrderTypeContext(slug: string): OrderTypeContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as OrderTypeContext;
    if (data.slug !== slug) return null;
    if (Date.now() - data.savedAt > TTL_MS) return null;
    if (data.orderType !== "curbside" && data.orderType !== "dine_in") return null;
    return data;
  } catch {
    return null;
  }
}

export function clearOrderTypeContext(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadOrderTypeContext(slug);
    if (existing) window.sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
