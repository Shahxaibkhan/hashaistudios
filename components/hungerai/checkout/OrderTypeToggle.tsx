"use client";

interface OrderTypeToggleProps {
  selected: "delivery" | "pickup";
  onSelect: (type: "delivery" | "pickup") => void;
}

export default function OrderTypeToggle({ selected, onSelect }: OrderTypeToggleProps) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-[var(--hai-border)] bg-[var(--hai-bg-card)]">
      <button
        onClick={() => onSelect("delivery")}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
          selected === "delivery"
            ? "bg-[var(--hai-accent-primary)] text-white"
            : "text-[var(--hai-text-muted)] hover:text-[var(--hai-text-primary)]"
        }`}
      >
        🛵 Delivery
      </button>
      <button
        onClick={() => onSelect("pickup")}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all ${
          selected === "pickup"
            ? "bg-[var(--hai-accent-primary)] text-white"
            : "text-[var(--hai-text-muted)] hover:text-[var(--hai-text-primary)]"
        }`}
      >
        🏃 Pickup
      </button>
    </div>
  );
}
