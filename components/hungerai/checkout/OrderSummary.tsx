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
  validationErrors?: Record<string, string>;
  orderType?: "delivery" | "pickup";
}

const ERROR_LABELS: Record<string, string> = {
  name: "Full Name",
  whatsapp: "WhatsApp Number",
  address: "Delivery Address",
  location: "Delivery Pin",
};

export default function OrderSummary({
  subtotal,
  deliveryFee,
  taxAmount,
  taxRate,
  total,
  onPlaceOrder,
  isSubmitting,
  isDisabled,
  validationErrors = {},
  orderType = "delivery",
}: OrderSummaryProps) {
  const errorKeys = Object.keys(validationErrors);

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
        {orderType === "delivery" && (
          <div className="flex items-center justify-between text-[var(--hai-text-muted)] text-sm">
            <span>Delivery Fee</span>
            <span>To be confirmed</span>
          </div>
        )}
        <div className="h-px bg-[var(--hai-border)]" />
        <div className="flex items-center justify-between text-lg font-bold text-[var(--hai-text-primary)]">
          <span>Total</span>
          <span>Rs {total.toLocaleString("en-PK")}{orderType === "delivery" ? "+" : ""}</span>
        </div>
      </div>

      {/* Validation Error Summary */}
      {errorKeys.length > 0 && (
        <div className="hai-closed-banner mt-4 flex items-start gap-2 text-sm">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>
            Please complete:{" "}
            <strong>{errorKeys.map((k) => ERROR_LABELS[k] ?? k).join(", ")}</strong>
          </span>
        </div>
      )}

      {/* Place Order Button */}
      <button
        className={`w-full mt-4 py-4 text-lg font-bold rounded-xl transition-all ${
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
