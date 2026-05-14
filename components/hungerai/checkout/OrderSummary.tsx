"use client";

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export default function OrderSummary({
  subtotal,
  deliveryFee,
  taxAmount,
  taxRate,
  total,
  onPlaceOrder,
  isSubmitting,
  isDisabled,
}: OrderSummaryProps) {
  return (
    <div className="hai-card p-4">
      {/* Summary Lines */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[var(--hai-text-secondary)]">
          <span>Subtotal</span>
          <span>Rs {subtotal.toLocaleString("en-PK")}</span>
        </div>
        {taxAmount > 0 && (
          <div className="flex items-center justify-between text-[var(--hai-text-muted)] text-sm">
            <span>Tax ({taxRate}%)</span>
            <span>Rs {taxAmount.toLocaleString("en-PK")}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[var(--hai-text-muted)] text-sm">
          <span>Delivery Fee</span>
          <span>To be confirmed</span>
        </div>
        <div className="h-px bg-[var(--hai-border)]" />
        <div className="flex items-center justify-between text-lg font-bold text-[var(--hai-text-primary)]">
          <span>Total</span>
          <span>Rs {total.toLocaleString("en-PK")}+</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        className={`w-full mt-6 py-4 text-lg font-bold rounded-xl transition-all ${
          isDisabled || isSubmitting
            ? "bg-[var(--hai-bg-tertiary)] text-[var(--hai-text-muted)] cursor-not-allowed"
            : "bg-[var(--hai-accent-primary)] text-white hover:bg-[var(--hai-accent-primary-hover)] shadow-lg"
        }`}
        onClick={onPlaceOrder}
        disabled={isDisabled || isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Placing Order...
          </span>
        ) : (
          "Place Order"
        )}
      </button>
    </div>
  );
}
