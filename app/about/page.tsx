export const metadata = {
  title: "About | HashAI Studios",
  description: "Story, mission, and philosophy behind HashAI Studios."
};

const pillars = [
  {
    title: "Mission",
    copy: "Accelerate the shift to AI-native organizations by crafting vertical intelligence that is premium, safe, and quietly powerful."
  },
  {
    title: "Vision",
    copy: "Every industry operates with a dedicated HashAI studio that blends domain playbooks with autonomous systems."
  }
];

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.6em] text-text-muted">About HashAI Studios</p>
        <h1 className="text-5xl font-semibold text-text-primary">We build AI that works quietly in the background.</h1>
        <p className="text-lg text-text-muted">
          HashAI started as an embedded strike team. We now run a constellation of studios that pair research, design, and
          engineering to unlock autonomy for operations teams worldwide.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-3xl border border-line bg-base-muted/60 p-6">
            <p className="text-xs uppercase tracking-[0.5em] text-neon">{pillar.title}</p>
            <p className="mt-4 text-text-muted">{pillar.copy}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-line bg-surface/80 p-8">
        <h2 className="text-3xl font-semibold text-text-primary">Studio-first product approach</h2>
        <p className="mt-4 text-text-muted">
          Instead of shipping modules in isolation, each studio operates as its own business unit with roadmaps, GTM,
          research partners, and dedicated operators. Shared components, safety rails, and telemetry make scale calm.
        </p>
      </section>
    </div>
  );
}
