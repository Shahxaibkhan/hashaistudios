// =============================================================================
// Database Types (mirrors Supabase schema)
// =============================================================================

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  whatsapp_number: string; // e.g., "923001234567" (no + or spaces)
  delivery_base_fee: number; // Rs flat base fee
  delivery_fee_per_km: number; // Rs per km
  delivery_radius_km: number; // max delivery distance
  city_lat: number; // default map center latitude
  city_lng: number; // default map center longitude
  is_open: boolean;
  owner_email: string | null;
  online_payment_details: string | null; // bank/JazzCash details
  created_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number; // PKR integers only
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

export interface ItemOption {
  id: string;
  menu_item_id: string;
  label: string;
  price_delta: number; // additional Rs (can be 0)
  option_type: "radio" | "checkbox";
}

export interface Order {
  id: string;
  order_number: number;
  restaurant_id: string;
  customer_name: string;
  customer_whatsapp: string;
  items: OrderItem[]; // JSONB snapshot
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_lat: number | null;
  delivery_lng: number | null;
  payment_method: "cod" | "online";
  wa_sent: boolean;
  created_at: string;
}

// =============================================================================
// Cart Types
// =============================================================================

export interface CartItemOption {
  id: string;
  label: string;
  price_delta: number;
}

export interface CartItem {
  id: string; // unique cart item ID (generated)
  menuItemId: string; // reference to menu_items.id
  name: string;
  price: number; // base price
  qty: number;
  options: CartItemOption[];
  totalPrice: number; // (price + sum of option deltas) * qty
}

export interface CartState {
  items: CartItem[];
  restaurantSlug: string | null;
}

// =============================================================================
// Order Types (for API/WhatsApp message)
// =============================================================================

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  options: { label: string; price_delta: number }[];
}

export interface OrderPayload {
  restaurant_id: string;
  customer_name: string;
  customer_whatsapp: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  delivery_lat: number | null;
  delivery_lng: number | null;
  delivery_address: string;
  payment_method: "cod" | "online";
}

export interface OrderResponse {
  order_number: number;
  id: string;
}

// =============================================================================
// Menu Page Types
// =============================================================================

export interface MenuItemWithOptions extends MenuItem {
  options: ItemOption[];
}

export interface CategoryWithItems extends Category {
  items: MenuItemWithOptions[];
}

export interface RestaurantWithMenu extends Restaurant {
  categories: CategoryWithItems[];
}

// =============================================================================
// Supabase Database Type (for typed client)
// =============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          logo_url: string | null;
          whatsapp_number: string;
          delivery_base_fee: number;
          delivery_fee_per_km: number;
          delivery_radius_km: number;
          city_lat: number;
          city_lng: number;
          is_open: boolean;
          owner_email: string | null;
          online_payment_details: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          logo_url?: string | null;
          whatsapp_number: string;
          delivery_base_fee?: number;
          delivery_fee_per_km?: number;
          delivery_radius_km?: number;
          city_lat?: number;
          city_lng?: number;
          is_open?: boolean;
          owner_email?: string | null;
          online_payment_details?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          logo_url?: string | null;
          whatsapp_number?: string;
          delivery_base_fee?: number;
          delivery_fee_per_km?: number;
          delivery_radius_km?: number;
          city_lat?: number;
          city_lng?: number;
          is_open?: boolean;
          owner_email?: string | null;
          online_payment_details?: string | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          sort_order?: number;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          sort_order?: number;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category_id?: string | null;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          sort_order?: number;
        };
      };
      item_options: {
        Row: {
          id: string;
          menu_item_id: string;
          label: string;
          price_delta: number;
          option_type: string;
        };
        Insert: {
          id?: string;
          menu_item_id: string;
          label: string;
          price_delta?: number;
          option_type?: string;
        };
        Update: {
          id?: string;
          menu_item_id?: string;
          label?: string;
          price_delta?: number;
          option_type?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: number;
          restaurant_id: string;
          customer_name: string;
          customer_whatsapp: string;
          items: Json;
          subtotal: number;
          delivery_fee: number;
          total: number;
          delivery_lat: number | null;
          delivery_lng: number | null;
          payment_method: string;
          wa_sent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number?: number;
          restaurant_id: string;
          customer_name: string;
          customer_whatsapp: string;
          items: Json;
          subtotal: number;
          delivery_fee: number;
          total: number;
          delivery_lat?: number | null;
          delivery_lng?: number | null;
          payment_method?: string;
          wa_sent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_number?: number;
          restaurant_id?: string;
          customer_name?: string;
          customer_whatsapp?: string;
          items?: Json;
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          delivery_lat?: number | null;
          delivery_lng?: number | null;
          payment_method?: string;
          wa_sent?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
