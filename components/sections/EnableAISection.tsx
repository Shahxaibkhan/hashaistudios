import type { Route } from "next";
import Link from "next/link";

const tracks = [
  "Executive AI Readiness",
  "AI for Operations Teams",
  "AI for Sales & Marketing",
  "AI Workflow Automation",
  "Industry-Specific AI Programs",
  "AI for Engineering Teams",
];

export function EnableAISection() {
  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
            <span className="h-px w-8 bg-neon/40" />
            EnableAI
          </div>
          <h2 className="text-3xl font-semibold text-text-primary md:text-[2.75rem] leading-tight">
            AI Enablement Programs.
          </h2>
          <p className="text-text-muted">
            We help organizations operationalize AI across teams and workflows through role-based
            programs, operational workshops, and embedded implementation.
          </p>
        </div>
        <Link
          href={"/enableai" as Route}
          className="shrink-0 self-start rounded-full border border-line px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-text-muted transition hover:border-neon hover:text-neon md:self-auto"
        >
          Explore EnableAI →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {tracks.map((track) => (
          <div
            key={track}
            className="flex items-center gap-3 rounded-xl border border-line bg-surface/80 px-5 py-4"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
            <span className="text-sm text-text-primary">{track}</span>
          </div>
        ))}
      </div>

      <p className="text-xs uppercase tracking-[0.45em] text-text-muted">
        On-site workshops&nbsp;&nbsp;·&nbsp;&nbsp;Remote cohorts&nbsp;&nbsp;·&nbsp;&nbsp;Embedded enablement
      </p>
    </section>
  );
}
