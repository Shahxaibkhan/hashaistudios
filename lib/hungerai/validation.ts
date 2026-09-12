import { z } from "zod";

export const orderItemOptionSchema = z.object({
  label: z.string().min(1).max(120),
  price_delta: z.number().finite(),
});

export const orderItemSchema = z.object({
  id: z.string().min(1).max(200),
  name: z.string().min(1).max(200), // display-only; server re-derives the real name from menu_items
  qty: z.number().int().min(1).max(50),
  price: z.number().finite(), // display-only; server re-derives the real price
  options: z.array(orderItemOptionSchema).max(20).default([]),
});

export const orderPayloadSchema = z.object({
  restaurant_id: z.string().uuid(),
  customer_name: z.string().trim().min(1).max(120),
  customer_whatsapp: z.string().trim().min(1).max(20),
  items: z.array(orderItemSchema).min(1).max(50),
  subtotal: z.number().finite().optional(), // ignored server-side, kept for backward compat
  delivery_fee: z.number().finite().min(0).max(100000).default(0),
  tax_amount: z.number().finite().optional(), // ignored server-side
  total: z.number().finite().optional(), // ignored server-side
  delivery_lat: z.number().finite().nullable().optional(),
  delivery_lng: z.number().finite().nullable().optional(),
  delivery_address: z.string().max(500).optional().default(""),
  payment_method: z.enum(["cod", "online", "card"]),
  order_type: z.enum(["delivery", "pickup"]).default("delivery"),
});

export type OrderPayloadInput = z.infer<typeof orderPayloadSchema>;

export const restaurantCreateSchema = z.object({
  slug: z.string().min(2).max(60),
  name: z.string().trim().min(1).max(120),
  whatsapp_number: z.string().trim().min(5).max(20),
  logo_url: z.string().url().nullable().optional(),
  owner_email: z.string().email().nullable().optional(),
  delivery_base_fee: z.number().int().min(0).max(100000).optional(),
  delivery_fee_per_km: z.number().int().min(0).max(100000).optional(),
  delivery_radius_km: z.number().int().min(0).max(500).optional(),
  city_lat: z.number().finite().optional(),
  city_lng: z.number().finite().optional(),
  online_payment_details: z.string().max(2000).nullable().optional(),
  card_on_delivery_enabled: z.boolean().optional(),
  pickup_enabled: z.boolean().optional(),
  delivery_enabled: z.boolean().optional(),
  pickup_address: z.string().max(500).nullable().optional(),
  is_open: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    restaurant_name: z.string().trim().min(1).max(120),
    slug: z.string().min(2).max(60),
    whatsapp_number: z.string().trim().min(5).max(20),
    access_token: z.string().min(1).optional(),
    user_id: z.string().uuid().optional(),
  })
  .refine((data) => !!data.access_token || !!data.user_id, {
    message: "Missing access_token or user_id",
  });

export const subscriptionUpdateSchema = z.object({
  subscription_status: z.enum(["trial", "active", "expired", "suspended"]),
  subscription_plan: z.enum(["starter", "boost", "pro"]).nullable(),
  months: z.number().int().min(0).max(36).optional(),
});
