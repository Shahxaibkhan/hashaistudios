"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartItemOption, MenuItemWithOptions } from "@/types/hungerai";

// Generate unique ID for cart items
function generateCartItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Calculate item total price including options
function calculateItemTotal(price: number, options: CartItemOption[], qty: number): number {
  const optionsDelta = options.reduce((sum, opt) => sum + opt.price_delta, 0);
  return (price + optionsDelta) * qty;
}

// Identifies "the same customization" so repeat adds of an identical
// item+options combo merge into one line instead of appearing twice.
function optionsSignature(options: CartItemOption[]): string {
  return options
    .map((o) => o.id)
    .sort()
    .join(",");
}

interface CartStore {
  // State
  items: CartItem[];
  restaurantSlug: string | null;

  // Actions
  addItem: (
    menuItem: MenuItemWithOptions,
    qty: number,
    selectedOptions: CartItemOption[],
    restaurantSlug: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  setRestaurantSlug: (slug: string) => void;

  // Computed (as functions since Zustand doesn't have computed)
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantSlug: null,

      addItem: (menuItem, qty, selectedOptions, restaurantSlug) => {
        set((state) => {
          // Switching restaurants clears the cart first.
          const baseItems =
            state.restaurantSlug && state.restaurantSlug !== restaurantSlug ? [] : state.items;

          const signature = optionsSignature(selectedOptions);
          const existingIndex = baseItems.findIndex(
            (item) => item.menuItemId === menuItem.id && optionsSignature(item.options) === signature
          );

          // Same item + same customization already in the cart — bump its
          // quantity instead of adding a second, identical-looking line.
          if (existingIndex !== -1) {
            const items = baseItems.map((item, idx) => {
              if (idx !== existingIndex) return item;
              const newQty = item.qty + qty;
              return {
                ...item,
                qty: newQty,
                totalPrice: calculateItemTotal(item.price, item.options, newQty),
              };
            });
            return { items, restaurantSlug };
          }

          const newItem: CartItem = {
            id: generateCartItemId(),
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            qty,
            options: selectedOptions,
            totalPrice: calculateItemTotal(menuItem.price, selectedOptions, qty),
          };

          return { items: [...baseItems, newItem], restaurantSlug };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, qty) => {
        if (qty < 1) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId
              ? {
                  ...item,
                  qty,
                  totalPrice: calculateItemTotal(item.price, item.options, qty),
                }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], restaurantSlug: null });
      },

      setRestaurantSlug: (slug) => {
        const state = get();
        // Clear cart if switching restaurants
        if (state.restaurantSlug && state.restaurantSlug !== slug) {
          set({ items: [], restaurantSlug: slug });
        } else {
          set({ restaurantSlug: slug });
        }
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },
    }),
    {
      name: "hungerai-cart",
      storage: createJSONStorage(() => localStorage),
      // Include restaurantSlug in persisted state to handle restaurant switching
      partialize: (state) => ({
        items: state.items,
        restaurantSlug: state.restaurantSlug,
      }),
    }
  )
);

// Hook to get cart for specific restaurant (ensures clean state)
export function useRestaurantCart(slug: string) {
  const store = useCartStore();

  // Auto-clear if slug doesn't match
  if (store.restaurantSlug && store.restaurantSlug !== slug) {
    store.setRestaurantSlug(slug);
  }

  return {
    items: store.restaurantSlug === slug ? store.items : [],
    addItem: (
      menuItem: MenuItemWithOptions,
      qty: number,
      selectedOptions: CartItemOption[]
    ) => store.addItem(menuItem, qty, selectedOptions, slug),
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    subtotal: store.restaurantSlug === slug ? store.getSubtotal() : 0,
    itemCount: store.restaurantSlug === slug ? store.getItemCount() : 0,
  };
}
