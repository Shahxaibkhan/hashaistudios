const reasons = [
  {
    title: "Studio Operating Model",
    copy: "Dedicated pods of strategists, designers, and ML engineers are embedded with each client until launch.",
    metric: "< 4 weeks discovery"
  },
  {
    title: "Enterprise Stack",
    copy: "Identity, governance, observability, and budget controls come standard across every deployment.",
    metric: "SOC2-ready"
  },
  {
    title: "Applied AI Craft",
    copy: "We design AI that behaves with context, tone, and purpose—paired with premium product UX.",
    metric: "NPS +62"
  }
];

export function WhyHashAI() {
  return (
    <section className="rounded-[32px] border border-line bg-gradient-to-br from-surface to-base-muted p-10">
      <div className="grid gap-8 md:grid-cols-3">
        {reasons.map((reason) => (
          <div key={reason.title} className="space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.5em] text-neon">
              <span className="h-10 w-10 rounded-full border border-line/70" />
              {reason.metric}
            </div>
            <h3 className="text-2xl font-semibold text-text-primary">{reason.title}</h3>
            <p className="text-text-muted">{reason.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
