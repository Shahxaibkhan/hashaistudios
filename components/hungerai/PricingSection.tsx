"use client";

import { useState } from "react";

const PLANS = [
  {
    name: "Starter",
    icon: "🚀",
    tagline: "Everything you need to get started and save time.",
    setup: "5,000",
    monthly: "3,999",
    popular: false,
    color: "#22c55e",
    features: [
      "Custom Online Ordering Link",
      "Structured WhatsApp Orders",
      "COD & Manual Payment Info",
      "Basic Customization (Logo, Colors)",
      "Up to 20 Menu Items",
      "Menu Updates (Standard)",
      "Email & WhatsApp Support",
    ],
    cta: "Get Started",
  },
  {
    name: "Boost",
    icon: "📈",
    tagline: "Increase your order value with deals and upsells.",
    setup: "7,000",
    monthly: "4,999",
    popular: true,
    color: "#ff5722",
    features: [
      "Everything in Starter",
      "Hot Deals Section",
      "Upselling & Add-ons",
      "Most Ordered / Recommended Tags",
      "Combo & Deal Management",
      "Priority Menu Updates",
      "Up to 50 Menu Items",
      "Priority Support",
    ],
    cta: "Grow More. Sell More.",
  },
  {
    name: "Pro",
    icon: "👑",
    tagline: "Get insights, track performance and grow your business.",
    setup: "9,000",
    monthly: "6,999",
    popular: false,
    color: "#a78bfa",
    features: [
      "Everything in Boost",
      "Sales Dashboard (Monthly)",
      "Total Orders & Revenue",
      "Top Selling Items",
      "Order History & Reports",
      "Basic Customer Insights",
      "Up to 100 Menu Items",
      "Priority Support + Account Manager",
    ],
    cta: "Know More. Grow Big.",
  },
];

type Plan = (typeof PLANS)[number];

function GetStartedModal({
  plan,
  onClose,
}: {
  plan: Plan;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi! I'm interested in the HungerAI *${plan.name} Plan* (Rs. ${plan.monthly}/month).\n\nHere are my details:\n• Restaurant Name: ${form.restaurantName}\n• Owner Name: ${form.ownerName}\n• Contact Number: ${form.phone}\n\nPlease get me started!`
    );
    window.open(`https://wa.me/923434994409?text=${msg}`, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "#111827" }}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: plan.color }} />

        <div className="p-7">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.08)" }}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Plan badge */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${plan.color}22` }}
            >
              {plan.icon}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Selected Plan
              </div>
              <div className="font-extrabold text-xl" style={{ color: plan.color }}>
                {plan.name} — Rs. {plan.monthly}
                <span className="text-sm font-medium text-gray-400">/mo</span>
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Fill in your details and we&apos;ll open WhatsApp with everything ready to send.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Burger Palace"
                value={form.restaurantName}
                onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder-gray-500"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = plan.color)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                Owner Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ahmed Khan"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder-gray-500"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = plan.color)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-widest">
                Contact Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0301 1234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder-gray-500"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = plan.color)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: plan.color }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Send on WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <>
      {/* Modal */}
      {selectedPlan && (
        <GetStartedModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}

      <section id="pricing" className="py-20 md:py-28" style={{ background: "#fafafa" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[var(--hai-accent-primary)] text-xs font-bold uppercase tracking-widest mb-3">
              Pricing
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-3 text-[var(--hai-text-primary)]">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[var(--hai-text-secondary)] max-w-xl mx-auto text-base">
              One-time setup. Monthly subscription. No commissions, ever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-3xl overflow-hidden"
                style={{
                  background: plan.popular ? "#111827" : "#ffffff",
                  border: plan.popular ? `2px solid ${plan.color}` : "2px solid #e5e7eb",
                  boxShadow: plan.popular
                    ? `0 0 0 4px ${plan.color}33, 0 20px 50px ${plan.color}30`
                    : "0 2px 12px rgba(0,0,0,0.06)",
                  transform: plan.popular ? "scale(1.04)" : "none",
                  zIndex: plan.popular ? 10 : 1,
                }}
              >
                {/* Most Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <span
                      className="text-white text-xs font-bold px-5 py-1.5 rounded-b-xl tracking-widest uppercase"
                      style={{ background: plan.color }}
                    >
                      ★ Most Popular ★
                    </span>
                  </div>
                )}

                <div className={`flex flex-col flex-1 p-7 ${plan.popular ? "pt-12" : ""}`}>
                  {/* Icon + Name */}
                  <div className="mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
                      style={{ background: `${plan.color}22` }}
                    >
                      {plan.icon}
                    </div>
                    <h3
                      className="font-display text-2xl font-extrabold"
                      style={{ color: plan.color }}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        plan.popular ? "text-gray-400" : "text-[var(--hai-text-muted)]"
                      }`}
                    >
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div
                    className="mb-5 pb-5"
                    style={{ borderBottom: `1px solid ${plan.popular ? "#374151" : "#e5e7eb"}` }}
                  >
                    <div
                      className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                        plan.popular ? "text-gray-400" : "text-[var(--hai-text-muted)]"
                      }`}
                    >
                      Setup &amp; Onboarding
                    </div>
                    <div className="font-extrabold text-2xl" style={{ color: plan.color }}>
                      Rs. {plan.setup}
                    </div>
                    <div
                      className={`text-xs mt-2 font-semibold uppercase tracking-widest mb-1 ${
                        plan.popular ? "text-gray-400" : "text-[var(--hai-text-muted)]"
                      }`}
                    >
                      Monthly
                    </div>
                    <div
                      className="font-extrabold text-3xl"
                      style={{ color: plan.popular ? "#ffffff" : "#111827" }}
                    >
                      Rs. {plan.monthly}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ background: plan.color }}
                        >
                          ✓
                        </span>
                        <span
                          className={`text-sm ${
                            plan.popular ? "text-gray-300" : "text-[var(--hai-text-secondary)]"
                          }`}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                    style={{
                      background: plan.popular ? plan.color : "transparent",
                      color: plan.popular ? "#ffffff" : plan.color,
                      border: `2px solid ${plan.color}`,
                    }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🔒", label: "Secure & Reliable" },
              { icon: "💬", label: "100% WhatsApp Integrated" },
              { icon: "🛠️", label: "We Set It Up. You Just Share." },
              { icon: "⚡", label: "Fast Setup. Quick Support." },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-[var(--hai-border)]"
              >
                <span className="text-xl flex-shrink-0">{b.icon}</span>
                <span className="text-xs font-semibold text-[var(--hai-text-secondary)]">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
