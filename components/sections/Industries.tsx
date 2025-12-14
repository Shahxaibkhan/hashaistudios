const industries = [
  { name: "Healthcare", detail: "Clinics, telehealth, life sciences" },
  { name: "Sports & Recreation", detail: "Arenas, courts, training centers" },
  { name: "Food & Hospitality", detail: "Restaurant groups, ghost kitchens" },
  { name: "Real Estate", detail: "Brokerages, proptech, developers" },
  { name: "Financial Services", detail: "Risk, ops, private markets" }
];

export function Industries() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.6em] text-text-muted">Industries we serve</p>
          <h2 className="mt-3 text-4xl font-semibold text-text-primary">Where HashAI deploys autonomy.</h2>
        </div>
        <p className="max-w-md text-sm text-text-muted">
          Each studio carries domain data models, integration kits, and compliance playbooks specific to that sector.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {industries.map((industry) => (
          <div key={industry.name} className="rounded-2xl border border-line bg-surface-soft/80 p-5">
            <p className="text-xl font-semibold text-text-primary">{industry.name}</p>
            <p className="text-sm text-text-muted">{industry.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
