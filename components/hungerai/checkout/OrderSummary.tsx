"use client";

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export default function OrderSummary({
  subtotal,
  deliveryFee,
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
        <div className="flex items-center justify-between text-[var(--hai-text-muted)] text-sm">
          <span>Delivery Fee</span>
          <span>To be confirmed</span>
        </div>
        <div className="h-px bg-[var(--hai-border)]" />
        <div className="flex items-center justify-between text-lg font-bold text-[var(--hai-text-primary)]">
          <span>Total</span>
          <span>Rs {subtotal.toLocaleString("en-PK")}+</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        className={`hai-btn w-full mt-6 py-4 text-lg font-bold ${
          isDisabled || isSubmitting
            ? "hai-btn-secondary cursor-not-allowed"
            : "hai-btn-wa"
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
          <>
            📱 Place Order via WhatsApp →
          </>
        )}
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-center text-[var(--hai-text-muted)] mt-3">
        You&apos;ll be redirected to WhatsApp to send your order
      </p>
    </div>
  );
}
