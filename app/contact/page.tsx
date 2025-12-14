export const metadata = {
  title: "Contact | HashAI Studios",
  description: "Partner with HashAI Studios to build premium AI products."
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.6em] text-text-muted">Contact</p>
        <h1 className="text-4xl font-semibold text-text-primary">Tell us about your AI initiative.</h1>
        <p className="text-text-muted">
          Share your priorities and we will respond within 48 hours with a tailored studio plan.
        </p>
      </section>

      <form className="space-y-6 rounded-3xl border border-line bg-base-muted/70 p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-text-muted">
            Full name
            <input
              type="text"
              className="w-full rounded-xl border border-line bg-transparent px-4 py-3 text-text-primary focus:border-neon focus:outline-none"
              placeholder="Jordan Patel"
            />
          </label>
          <label className="space-y-2 text-sm text-text-muted">
            Work email
            <input
              type="email"
              className="w-full rounded-xl border border-line bg-transparent px-4 py-3 text-text-primary focus:border-neon focus:outline-none"
              placeholder="you@company.com"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-text-muted">
          Company / Organization
          <input
            type="text"
            className="w-full rounded-xl border border-line bg-transparent px-4 py-3 text-text-primary focus:border-neon focus:outline-none"
            placeholder="Atlas Health Group"
          />
        </label>
        <label className="space-y-2 text-sm text-text-muted">
          How can we help?
          <textarea
            className="w-full rounded-xl border border-line bg-transparent px-4 py-3 text-text-primary focus:border-neon focus:outline-none"
            rows={5}
            placeholder="We are launching AI automation across..."
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-neon px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-base transition hover:bg-white"
        >
          Submit
        </button>
      </form>

      <div className="space-y-3 text-sm text-text-muted">
        <p>
          Email: <a href="mailto:hello@hashaistudios.com" className="text-neon">hello@hashaistudios.com</a>
        </p>
        <p>
          WhatsApp: <a href="https://wa.me/923434994409" className="text-neon">+92 3434 994409</a>
        </p>
      </div>
    </div>
  );
}
