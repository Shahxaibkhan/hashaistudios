"use client";

interface PaymentSelectorProps {
  selected: "cod" | "online";
  onSelect: (method: "cod" | "online") => void;
  onlinePaymentDetails: string | null;
}

export default function PaymentSelector({
  selected,
  onSelect,
  onlinePaymentDetails,
}: PaymentSelectorProps) {
  return (
    <div className="space-y-3">
      {/* COD Option */}
      <div
        className={`hai-payment-card ${selected === "cod" ? "selected" : ""}`}
        onClick={() => onSelect("cod")}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected === "cod"
                ? "border-[var(--hai-accent-primary)] bg-[var(--hai-accent-primary)]"
                : "border-[var(--hai-border)]"
            }`}
          >
            {selected === "cod" && (
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--hai-text-primary)]">
              💵 Cash on Delivery
            </h3>
            <p className="text-sm text-[var(--hai-text-muted)] mt-1">
              Pay when your order arrives
            </p>
          </div>
        </div>
      </div>

      {/* Online Payment Option */}
      <div
        className={`hai-payment-card ${selected === "online" ? "selected" : ""}`}
        onClick={() => onSelect("online")}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected === "online"
                ? "border-[var(--hai-accent-primary)] bg-[var(--hai-accent-primary)]"
                : "border-[var(--hai-border)]"
            }`}
          >
            {selected === "online" && (
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--hai-text-primary)]">
              💳 Online Payment
            </h3>
            <p className="text-sm text-[var(--hai-text-muted)] mt-1">
              Pay via JazzCash or bank transfer
            </p>
          </div>
        </div>

        {/* Online payment details */}
        {selected === "online" && onlinePaymentDetails && (
          <div className="mt-3 pt-3 border-t border-[var(--hai-border-subtle)]">
            <h4 className="text-sm font-semibold text-[var(--hai-text-secondary)] mb-2">
              Payment Details:
            </h4>
            <div className="bg-[var(--hai-bg-elevated)] p-3 rounded-lg">
              <pre className="text-sm text-[var(--hai-text-primary)] whitespace-pre-wrap font-sans">
                {onlinePaymentDetails}
              </pre>
            </div>
            <p className="text-xs text-[var(--hai-text-muted)] mt-2">
              Please send payment before the rider arrives and share the screenshot on WhatsApp.
            </p>
          </div>
        )}

        {/* No payment details configured */}
        {selected === "online" && !onlinePaymentDetails && (
          <div className="mt-3 pt-3 border-t border-[var(--hai-border-subtle)]">
            <p className="text-sm text-[var(--hai-accent-amber)]">
              ⚠️ Online payment details not configured. Contact the restaurant on WhatsApp for payment info.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
