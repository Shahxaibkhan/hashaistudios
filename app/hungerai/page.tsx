import Link from "next/link";
import type { Metadata } from "next";
import PricingSection from "@/components/hungerai/PricingSection";

export const metadata: Metadata = {
  title: "HungerAI – WhatsApp Food Ordering for Restaurants",
  description:
    "Turn your restaurant menu into a WhatsApp ordering system. No app downloads, no commissions. Customers order directly to your WhatsApp.",
};

const FEATURES = [
  {
    icon: "📱",
    title: "Branded Menu Page",
    description: "A stunning ordering page with your logo, colors, categories, and item photos. Works perfectly on every phone.",
  },
  {
    icon: "🛒",
    title: "Smart Cart",
    description: "Customers add items, pick sizes and add-ons, and see a live running total before they order.",
  },
  {
    icon: "📍",
    title: "GPS Location Sharing",
    description: "One-tap location detection with a Google Maps link so your riders always find the right address.",
  },
  {
    icon: "💬",
    title: "WhatsApp Checkout",
    description: "A perfectly formatted order lands in your WhatsApp inbox. Confirm with a single reply.",
  },
  {
    icon: "⚡",
    title: "Zero Friction",
    description: "No app downloads. No signups. Customers just tap a link and they're ordering in seconds.",
  },
  {
    icon: "💰",
    title: "Zero Commission",
    description: "Every rupee from every order is yours. One flat monthly subscription, nothing more.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Book a Call", description: "Tell us about your restaurant, menu, and delivery area. We'll handle everything from there." },
  { step: "02", title: "We Build It", description: "Your fully branded ordering page goes live within 48 hours — menu, photos, and all." },
  { step: "03", title: "Take Orders", description: "Share your link anywhere. Orders flow to your WhatsApp and you grow — commission-free." },
];

export default function HungerAILandingPage() {
  const whatsappNumber = "923434994409";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi!%20I'm%20interested%20in%20HungerAI%20for%20my%20restaurant.`;

  return (
    <div className="min-h-screen bg-white text-[var(--hai-text-primary)]">
      {/* ── HERO ── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20 flex flex-col items-center text-center">
          <img
            src="/branding/hungerai-logo.png"
            alt="HungerAI"
            className="h-20 md:h-28 w-auto mb-10"
            draggable="false"
          />
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--hai-accent-primary)] inline-block"></span>
            <span className="text-[var(--hai-text-muted)] text-sm font-medium tracking-widest uppercase">WhatsApp Food Ordering · Zero Commission</span>
            <span className="w-2 h-2 rounded-full bg-[var(--hai-accent-primary)] inline-block"></span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-[var(--hai-text-primary)]">
            Your Menu.&nbsp;
            <span className="text-[var(--hai-accent-primary)]">Their WhatsApp.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--hai-text-secondary)] max-w-2xl mb-10 leading-relaxed">
            Turn your restaurant into a 24/7 ordering machine. Customers browse your branded menu, customise their order, and send it straight to your WhatsApp — no app, no commission.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--hai-accent-primary)] text-white font-bold text-lg shadow-lg hover:bg-[var(--hai-accent-primary-hover)] transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Book a Free Demo
            </a>
            <a
              href="#how"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl border-2 border-[var(--hai-border)] text-[var(--hai-text-primary)] font-semibold text-lg hover:border-[var(--hai-accent-primary)] hover:text-[var(--hai-accent-primary)] transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-[var(--hai-border)] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-[var(--hai-border)]">
          {[
            { value: "0%", label: "Commission", sub: "Keep every rupee" },
            { value: "2B+", label: "WhatsApp Users", sub: "Already on their phones" },
            { value: "48h", label: "Go Live", sub: "From call to first order" },
          ].map((s) => (
            <div key={s.label} className="text-center px-6">
              <div className="text-4xl md:text-5xl font-black text-[var(--hai-text-primary)] tracking-tight">{s.value}</div>
              <div className="text-sm font-semibold text-[var(--hai-text-primary)] mt-1">{s.label}</div>
              <div className="text-xs text-[var(--hai-text-muted)] mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 md:py-28" style={{ background: "#fafafa" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[var(--hai-accent-primary)] text-xs font-bold uppercase tracking-widest mb-3">What You Get</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-3 text-[var(--hai-text-primary)]">Everything You Need</h2>
            <p className="text-[var(--hai-text-secondary)] max-w-xl mx-auto text-base">A complete ordering system built for WhatsApp — where your customers already are.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group p-7 rounded-2xl border border-transparent bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#fff1ec] flex items-center justify-center text-xl mb-5">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[15px] mb-2 text-[var(--hai-text-primary)]">{f.title}</h3>
                <p className="text-[var(--hai-text-muted)] text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-[var(--hai-accent-primary)] text-xs font-bold uppercase tracking-widest mb-3">How It Works</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-3 text-[var(--hai-text-primary)]">Up & Running in 3 Steps</h2>
            <p className="text-[var(--hai-text-secondary)] max-w-xl mx-auto">From first call to first order in under 48 hours.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl border-2 border-[var(--hai-accent-primary)] text-[var(--hai-accent-primary)] text-lg font-black flex items-center justify-center mb-5">
                  {item.step}
                </div>
                <h3 className="font-bold text-base mb-2 text-[var(--hai-text-primary)]">{item.title}</h3>
                <p className="text-[var(--hai-text-muted)] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <PricingSection />

      {/* ── CTA ── */}
      <section className="py-20 md:py-28" style={{ background: "#111827" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-[var(--hai-accent-primary)] text-xs font-bold uppercase tracking-widest mb-5">Get Started Today</span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to Grow Your<br />Restaurant?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join restaurants using HungerAI to receive WhatsApp orders —
            no app, no commission, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--hai-accent-primary)] text-white font-bold text-base hover:bg-[var(--hai-accent-primary-hover)] transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Book a Free Demo
            </a>
            <a href="tel:03434994409" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors">
              📞 0343-4994409
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-[var(--hai-border)] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/branding/hungerai-logo.png" alt="HungerAI" className="h-8 w-auto" draggable="false" />
          <p className="text-sm text-[var(--hai-text-muted)] text-center">
            &copy; {new Date().getFullYear()} HungerAI &mdash; A product of{" "}
            <Link href="/" className="text-[var(--hai-accent-primary)] hover:underline font-medium">
              HashAI Studios
            </Link>
          </p>
        </div>
      </footer>

    </div>
  );
}
