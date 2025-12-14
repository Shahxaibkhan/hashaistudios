const pillars = [
  {
    title: "AI Automation",
    copy: "Enterprise-grade autonomation that wraps around your internal procedures, controls, and compliance.",
    deliverable: "Runbooks, guardrails, telemetry"
  },
  {
    title: "AI Assistants",
    copy: "Multi-channel copilots that live inside email, chat, voice, and field tools with identity and context.",
    deliverable: "Personas, tooling adapters"
  },
  {
    title: "AI SaaS",
    copy: "Subscription products that fuse AI reasoning with opinionated workflows and premium UX.",
    deliverable: "Dashboards, insights, admin controls"
  },
  {
    title: "AI Platforms",
    copy: "Composable infrastructure that powers multi-tenant deployments with observability and budget controls.",
    deliverable: "Data plane, governance"
  }
];

export function WhatWeBuild() {
  return (
    <section className="space-y-12">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
          <span className="h-px w-8 bg-iris/50" />
          What we build
        </div>
        <h2 className="mt-4 text-4xl font-semibold text-text-primary">Purpose-built AI systems that scale as studios.</h2>
        <p className="mt-3 text-text-muted">
          We pair product design and ML engineers with domain strategists. The result: AI that feels crafted yet deploys
          like infrastructure.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {pillars.map((pillar, index) => (
          <div key={pillar.title} className="relative overflow-hidden rounded-2xl border border-line bg-surface/80 p-7">
            <div className="absolute right-6 top-6 text-6xl font-semibold text-white/5">{String(index + 1).padStart(2, "0")}</div>
            <h3 className="text-2xl font-semibold text-text-primary">{pillar.title}</h3>
            <p className="mt-4 text-text-muted">{pillar.copy}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.5em] text-neon">{pillar.deliverable}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
