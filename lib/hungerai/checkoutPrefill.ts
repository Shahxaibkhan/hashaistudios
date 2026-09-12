"use client";

/**
 * Remembers a customer's name/WhatsApp/delivery address on this device so a
 * repeat order (same restaurant or not) doesn't require retyping everything.
 * Purely local convenience — never sent anywhere, no account involved.
 */

const KEY = "hungerai_checkout_prefill";

export interface CheckoutPrefill {
  name: string;
  whatsapp: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

export function loadCheckoutPrefill(): CheckoutPrefill | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutPrefill;
  } catch {
    return null;
  }
}

export function saveCheckoutPrefill(data: CheckoutPrefill): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Private browsing / storage quota — skip silently, not critical
  }
}
