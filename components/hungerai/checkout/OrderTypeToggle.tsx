"use client";

import type { OrderType } from "@/types/hungerai";
import { ORDER_TYPE_META } from "@/lib/hungerai/orderTypes";

interface OrderTypeToggleProps {
  selected: OrderType;
  onSelect: (type: OrderType) => void;
  available: OrderType[];
}

export default function OrderTypeToggle({ selected, onSelect, available }: OrderTypeToggleProps) {
  // Most restaurants only ever show 2 options (delivery/pickup) — a QR scan
  // can add a 3rd. 4 at once is a rare/manual-testing case, handled as a
  // clean 2x2 grid rather than cramming 4 buttons into one row.
  const cols = available.length >= 4 ? "grid-cols-2" : available.length === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid ${cols} gap-2`}>
      {available.map((type) => {
        const meta = ORDER_TYPE_META[type];
        const isSelected = selected === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-sm font-semibold transition-all ${
              isSelected
                ? "bg-[var(--hai-accent-primary)] border-[var(--hai-accent-primary)] text-white"
                : "bg-[var(--hai-bg-card)] border-[var(--hai-border)] text-[var(--hai-text-muted)] hover:text-[var(--hai-text-primary)]"
            }`}
          >
            <span>{meta.emoji}</span>
            <span className="truncate">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
