"use client";

interface PaymentSelectorProps {
  selected: "cod" | "online" | "card";
  onSelect: (method: "cod" | "online" | "card") => void;
  onlinePaymentDetails: string | null;
  cardOnDeliveryEnabled: boolean;
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <div
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
        active
          ? "border-[var(--hai-accent-primary)] bg-[var(--hai-accent-primary)]"
          : "border-[var(--hai-border)]"
      }`}
    >
      {active && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
    </div>
  );
}

export default function PaymentSelector({
  selected,
  onSelect,
  onlinePaymentDetails,
  cardOnDeliveryEnabled,
}: PaymentSelectorProps) {
  return (
    <div className="space-y-3">
      {/* COD — always shown */}
      <div
        className={`hai-payment-card ${selected === "cod" ? "selected" : ""}`}
        onClick={() => onSelect("cod")}
      >
        <div className="flex items-center gap-4">
          <RadioDot active={selected === "cod"} />
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--hai-text-primary)]">💵 Cash on Delivery</h3>
            <p className="text-sm text-[var(--hai-text-muted)] mt-1">Pay when your order arrives</p>
          </div>
        </div>
      </div>

      {/* Online Payment — only shown if configured */}
      {onlinePaymentDetails && (
        <div
          className={`hai-payment-card ${selected === "online" ? "selected" : ""}`}
          onClick={() => onSelect("online")}
        >
          <div className="flex items-center gap-4">
            <RadioDot active={selected === "online"} />
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--hai-text-primary)]">💳 Online Payment</h3>
              <p className="text-sm text-[var(--hai-text-muted)] mt-1">Pay via JazzCash or bank transfer</p>
            </div>
          </div>

          {selected === "online" && (
            <div className="mt-3 pt-3 border-t border-[var(--hai-border-subtle)]">
              <h4 className="text-sm font-semibold text-[var(--hai-text-secondary)] mb-2">Payment Details:</h4>
              <div className="bg-[var(--hai-bg-elevated)] p-3 rounded-lg">
                <pre className="text-sm text-[var(--hai-text-primary)] whitespace-pre-wrap font-sans">
                  {onlinePaymentDetails}
                </pre>
              </div>
              <p className="text-xs text-[var(--hai-text-muted)] mt-2">
                Send payment before the rider arrives and share the screenshot on WhatsApp.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Card on Delivery — only shown if enabled by restaurant */}
      {cardOnDeliveryEnabled && (
        <div
          className={`hai-payment-card ${selected === "card" ? "selected" : ""}`}
          onClick={() => onSelect("card")}
        >
          <div className="flex items-center gap-4">
            <RadioDot active={selected === "card"} />
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--hai-text-primary)]">💳 Card on Delivery</h3>
              <p className="text-sm text-[var(--hai-text-muted)] mt-1">Swipe your card when the rider arrives</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
