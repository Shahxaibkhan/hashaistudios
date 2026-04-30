"use client";

import type { CartItem } from "@/types/hungerai";

interface CartReviewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartReview({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartReviewProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="hai-card p-4 flex items-start gap-3"
        >
          {/* Item Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--hai-text-primary)]">
              {item.name}
            </h3>
            {item.options.length > 0 && (
              <p className="text-sm text-[var(--hai-text-muted)] mt-1">
                {item.options.map((o) => o.label).join(", ")}
              </p>
            )}
            <p className="text-[var(--hai-text-secondary)] mt-2">
              Rs {item.totalPrice.toLocaleString("en-PK")}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <div className="hai-stepper">
              <button
                onClick={() => onUpdateQuantity(item.id, item.qty - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{item.qty}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.qty + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="w-8 h-8 rounded-full bg-[var(--hai-bg-elevated)] flex items-center justify-center text-[var(--hai-accent-red)] hover:bg-[var(--hai-bg-card)] transition-colors"
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
