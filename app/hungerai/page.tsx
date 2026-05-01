import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HungerAI - WhatsApp Food Ordering for Restaurants",
  description:
    "Turn your restaurant menu into a WhatsApp ordering system. No app downloads, no commissions. Customers order directly to your WhatsApp.",
};

export default function HungerAILandingPage() {
  const whatsappNumber = "923434994409";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi!%20I'm%20interested%20in%20HungerAI%20for%20my%20restaurant.`;

  return (
    <div className="min-h-screen bg-[var(--hai-bg-primary)] text-[var(--hai-text-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--hai-accent-primary)] to-[#ff7043] opacity-5" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--hai-accent-primary-light)] text-[var(--hai-accent-primary)] text-sm font-semibold mb-6">
              🍔 WhatsApp Ordering for Restaurants
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your Menu.
              <br />
              <span className="text-[var(--hai-accent-primary)]">
                Their WhatsApp.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--hai-text-secondary)] max-w-2xl mx-auto mb-10">
              Turn your restaurant menu into a beautiful ordering page. Customers browse, 
              customize, and send orders directly to your WhatsApp. No apps. No commissions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[var(--hai-accent-primary)] text-white font-bold text-lg hover:bg-[var(--hai-accent-primary-hover)] transition-colors shadow-lg"
              >
                Book a Demo →
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-[var(--hai-border)] text-[var(--hai-text-primary)] font-semibold hover:border-[var(--hai-accent-primary)] hover:text-[var(--hai-accent-primary)] transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[var(--hai-border)] bg-[var(--hai-bg-card)]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--hai-accent-primary)]">0%</div>
              <div className="text-sm text-[var(--hai-text-muted)] mt-1">Commission</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--hai-accent-primary)]">2B+</div>
              <div className="text-sm text-[var(--hai-text-muted)] mt-1">WhatsApp Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[var(--hai-accent-primary)]">24/7</div>
              <div className="text-sm text-[var(--hai-text-muted)] mt-1">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-[var(--hai-text-secondary)] max-w-xl mx-auto">
              A complete ordering system that works where your customers already are.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📱",
                title: "Beautiful Menu Page",
                description:
                  "Branded menu with categories, images, and item customization. Works on any phone.",
              },
              {
                icon: "🛒",
                title: "Smart Cart",
                description:
                  "Customers add items, customize options, and see their total before ordering.",
              },
              {
                icon: "📍",
                title: "GPS Location",
                description:
                  "One-tap location detection with Google Maps link for accurate deliveries.",
              },
              {
                icon: "💬",
                title: "WhatsApp Checkout",
                description:
                  "Orders go straight to your WhatsApp. Reply, confirm, and deliver.",
              },
              {
                icon: "⚡",
                title: "No App Required",
                description:
                  "Customers just open a link. No downloads, no signups, no friction.",
              },
              {
                icon: "💰",
                title: "Zero Commission",
                description:
                  "Keep 100% of your revenue. Just a simple monthly subscription.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[var(--hai-bg-card)] border border-[var(--hai-border)] hover:border-[var(--hai-accent-primary)] transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-[var(--hai-text-muted)] text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-[var(--hai-bg-card)] border-y border-[var(--hai-border)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-[var(--hai-text-secondary)]">
              Your journey to WhatsApp orders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Book a Consultation",
                description:
                  "We discuss your menu, branding, and delivery zones to understand your needs.",
              },
              {
                step: "2",
                title: "We Build Your System",
                description:
                  "Our team creates your custom ordering page with your branding and menu.",
              },
              {
                step: "3",
                title: "Go Live & Grow",
                description:
                  "Launch your ordering page, receive orders, and get ongoing support.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--hai-accent-primary)] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-[var(--hai-text-muted)] text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-[var(--hai-text-secondary)] mb-10 max-w-xl mx-auto">
            Join restaurants already using HungerAI to take orders on WhatsApp. 
            Get set up in minutes.
          </p>

          <div className="flex flex-col items-center gap-6">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 rounded-xl bg-[var(--hai-accent-primary)] text-white font-bold text-xl hover:bg-[var(--hai-accent-primary-hover)] transition-colors shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
            <a
              href="tel:03434994409"
              className="text-[var(--hai-text-muted)] hover:text-[var(--hai-accent-primary)] transition-colors"
            >
              Or call: 0343-4994409
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--hai-border)] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="font-display font-bold text-lg">HungerAI</span>
          </div>
          <p className="text-sm text-[var(--hai-text-muted)]">
            A product of{" "}
            <Link
              href="/"
              className="text-[var(--hai-accent-primary)] hover:underline"
            >
              HashAI Studios
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
