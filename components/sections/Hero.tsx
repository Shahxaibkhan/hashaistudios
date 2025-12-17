import Link from "next/link";

const heroStats = [
  { label: "Studios shipped", value: "06", meta: "Healthcare, Sports, Food" },
  { label: "Automation coverage", value: "72%", meta: "Average workflow lift" },
  { label: "Time to first pilot", value: "30d", meta: "From intake to deployment" }
];

const signalTags = ["Healthcare systems", "Sports complexes", "Hospitality groups", "Proptech", "Financial ops"];

export function Hero() {
  return (
    <section className="relative flex w-full flex-col gap-8 overflow-hidden rounded-[24px] border border-line bg-base-muted/70 px-4 py-10 shadow-card sm:rounded-[32px] sm:px-8 sm:py-14 md:grid md:grid-cols-[1.1fr_0.9fr] md:gap-10 lg:rounded-[40px] lg:px-12 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-radial-grid opacity-60" />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2 text-[0.55rem] uppercase tracking-[0.3em] text-text-muted sm:gap-3 sm:text-[0.65rem] sm:tracking-[0.5em]">
          <span className="h-px w-10 bg-neon/60" />
          AI Agency + Product Studio
        </div>
        <h1 className="break-words text-pretty text-2xl font-semibold leading-[1.15] text-text-primary sm:text-[2.85rem] md:text-[3.5rem]">
          HashAI Studios build vertical AI that feels bespoke, performs like infrastructure.
        </h1>
        <p className="break-words text-pretty text-base leading-relaxed text-text-muted sm:text-lg">
          HashAI Studios embeds autonomous AI systems across clinics, arenas, restaurants, and real estate portfolios.
          Every studio ships domain-trained copilots, observability, and premium product craft.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/studios"
            className="w-full rounded-full bg-neon px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-base transition hover:bg-white sm:w-auto"
          >
            Explore Studios
          </Link>
          <Link
            href="/contact"
            className="w-full rounded-full border border-line px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-text-primary transition hover:border-neon hover:text-neon sm:w-auto"
          >
            Contact Team
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 text-[0.6rem] uppercase tracking-[0.25em] text-text-muted sm:gap-3">
          {signalTags.map((tag) => (
            <span key={tag} className="rounded-full border border-line px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-[24px] border border-line/80 bg-surface/80 p-4 sm:rounded-[30px] sm:p-6">
        <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_top,_rgba(125,249,255,0.25),_transparent_65%)] opacity-70" />
        <div className="relative flex flex-col gap-6">
          <div className="w-full rounded-[18px] border border-line bg-base/90 px-6 py-4 text-center sm:rounded-[20px] sm:px-8 sm:py-5">
            <p className="text-2xl font-semibold tracking-[0.25em] text-text-primary sm:text-4xl sm:tracking-[0.35em]">
              HASH<span className="text-neon">AI</span>
            </p>
            <p className="text-[0.55rem] uppercase tracking-[0.45em] text-text-muted sm:text-xs sm:tracking-[0.6em]">Studios</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-base/60 p-5 sm:p-6">
                <p className="text-[0.6rem] uppercase tracking-[0.4em] text-neon sm:text-xs sm:tracking-[0.5em]">Studio Network</p>
                <p className="mt-3 text-xl font-semibold leading-snug text-text-primary sm:mt-4 sm:text-2xl">
                  Dedicated pods, shared intelligence, measurable business lift.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  Strategy, design, and engineering form a single operating layer across every deployment.
                </p>
              </div>
          <div className="grid gap-4 md:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/5 bg-base/40 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-text-muted">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-neon">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.meta}</p>
              </div>
            ))}
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <p className="text-sm text-text-muted">Signal Feed</p>
            <p className="mt-2 text-lg text-text-primary">Live orchestration across intake, ops, and customer experience.</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <span className="rounded-full bg-neon/20 px-3 py-1 text-neon">Observability</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-text-primary">Human-in-the-loop</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-text-primary">Governance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
