import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EnableAI – Enterprise AI Enablement | HashAI Studios",
  description:
    "Workforce AI transformation for modern businesses. Role-based operational AI programs for executive teams, operations, engineering, and industry-specific deployment.",
};

const WHATSAPP_LINK =
  "https://wa.me/923434994409?text=Hi%2C%20I%27d%20like%20to%20discuss%20an%20AI%20enablement%20program%20for%20my%20organization.";

const PROBLEMS = [
  {
    title: "Adoption Without Capability",
    description:
      "AI tools are deployed organization-wide, but teams lack the operational context to use them effectively — creating friction, not efficiency.",
  },
  {
    title: "Stalled Productivity",
    description:
      "Without structured enablement, AI investments plateau early. Teams revert to existing workflows, leaving significant productivity gains unrealized.",
  },
  {
    title: "Execution Falls Behind",
    description:
      "Competitors who operationalize AI across functions compound advantages rapidly. The window for first-mover efficiency closes faster than expected.",
  },
];

const TRACKS = [
  {
    index: "01",
    title: "Executive AI Readiness",
    description:
      "Strategic AI fluency for leadership — decision frameworks, governance models, and organizational AI roadmaps for C-suite and senior management.",
  },
  {
    index: "02",
    title: "AI for Operations Teams",
    description:
      "Operational AI integration for process teams — workflow automation, reporting efficiency, and AI-assisted decision-making for day-to-day operations.",
  },
  {
    index: "03",
    title: "AI for Sales & Marketing",
    description:
      "Revenue workflow augmentation — AI-assisted prospecting, customer communication, pipeline management, and campaign execution at scale.",
  },
  {
    index: "04",
    title: "AI Workflow Automation",
    description:
      "End-to-end process modernization — identifying, mapping, and automating high-friction workflows across departments and business units.",
  },
  {
    index: "05",
    title: "Industry-Specific AI Programs",
    description:
      "Sector-tailored enablement combining domain knowledge with AI deployment — healthcare, real estate, hospitality, financial services, and more.",
  },
  {
    index: "06",
    title: "AI for Engineering Teams",
    description:
      "AI-accelerated engineering operations — AI-assisted software delivery, QA acceleration workflows, agile workflow augmentation, sprint intelligence, and engineering documentation automation.",
  },
];

const OUTCOMES = [
  "Reduce repetitive operational workload across functions",
  "Improve customer response efficiency and resolution time",
  "Accelerate internal reporting and decision workflows",
  "Standardize AI usage across teams with governance controls",
  "Reduce execution bottlenecks in delivery and operations",
];

const GOVERNANCE = [
  {
    title: "Controlled AI Adoption",
    description:
      "Structured rollout frameworks that prevent uncontrolled AI usage across the organization.",
  },
  {
    title: "Role-Based Usage",
    description:
      "Define who uses which AI capabilities and how — aligned with organizational hierarchy and compliance requirements.",
  },
  {
    title: "Workflow Compliance",
    description:
      "AI deployment that respects existing compliance requirements, data governance policies, and industry regulations.",
  },
  {
    title: "Secure Implementation",
    description:
      "Data handling protocols and implementation standards that protect organizational data throughout the enablement process.",
  },
];

const DELIVERY = [
  {
    format: "On-Site Workshops",
    detail:
      "Embedded delivery within your office or facility. Teams learn and apply AI within their operational context.",
  },
  {
    format: "Remote Cohorts",
    detail:
      "Structured virtual programs across distributed teams, time zones, and organizational units.",
  },
  {
    format: "Embedded Enablement",
    detail:
      "Long-term embedded programs where HashAI works alongside your teams to drive adoption over weeks or months.",
  },
];

const STUDIO_PROGRAMS = [
  {
    studio: "HungerAI",
    href: "/studios/hungerai",
    program: "Restaurant AI Transformation",
    description:
      "Equip restaurant operators and staff to leverage AI across ordering, operations, inventory, and guest communication.",
    industry: "Food & Hospitality",
  },
  {
    studio: "EstateAI",
    href: "/studios/estateai",
    program: "AI Lead Handling for Brokerages",
    description:
      "Train brokerage teams to deploy AI across lead qualification, nurturing, CRM workflows, and client communication.",
    industry: "Real Estate",
  },
  {
    studio: "ClinicAI",
    href: "/studios/clinicia",
    program: "AI Workflow Systems for Clinics",
    description:
      "Enable clinical and administrative staff to operate AI-powered intake, scheduling, and patient communication systems.",
    industry: "Healthcare",
  },
];

export default function EnableAIPage() {
  return (
    <div className="space-y-32 pb-32">

      {/* ── HERO ── */}
      <section className="pt-16 md:pt-24">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
            <span className="h-px w-8 bg-neon/40" />
            Enterprise AI Enablement
          </div>
          <h1 className="text-5xl font-semibold leading-[1.1] text-text-primary md:text-[3.5rem]">
            AI tools alone do not{" "}
            <span className="text-neon">transform</span>{" "}
            organizations.{" "}
            <br className="hidden md:block" />
            Operational capability does.
          </h1>
          <p className="text-lg text-text-muted max-w-2xl">
            EnableAI delivers role-based, embedded AI transformation programs for operational teams,
            executive leadership, and engineering organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-neon px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-base transition hover:bg-white sm:w-auto"
            >
              Book a Consultation
            </a>
            <a
              href="#assessment"
              className="inline-flex w-full items-center justify-center rounded-full border border-line px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-text-primary transition hover:border-neon hover:text-neon sm:w-auto"
            >
              AI Readiness Assessment
            </a>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
            <span className="h-px w-8 bg-iris/50" />
            The challenge
          </div>
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
            Why AI investments stall inside organizations.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((problem) => (
            <div
              key={problem.title}
              className="rounded-2xl border border-line bg-surface/80 p-7 space-y-3"
            >
              <h3 className="text-lg font-semibold text-text-primary">{problem.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ENABLEMENT TRACKS ── */}
      <section className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
            <span className="h-px w-8 bg-neon/40" />
            Enablement tracks
          </div>
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
            Role-based programs built for operational deployment.
          </h2>
          <p className="text-text-muted">
            Each track is designed around how that function actually works — not generic AI theory.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => (
            <div
              key={track.title}
              className="relative overflow-hidden rounded-2xl border border-line bg-surface/80 p-7 space-y-3"
            >
              <div className="absolute right-5 top-5 text-5xl font-semibold text-white/[0.04]">
                {track.index}
              </div>
              <h3 className="text-lg font-semibold text-text-primary">{track.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{track.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OPERATIONAL OUTCOMES ── */}
      <section className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
            <span className="h-px w-8 bg-neon/40" />
            Operational outcomes
          </div>
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
            Measurable impact across functions.
          </h2>
        </div>
        <div className="rounded-2xl border border-line bg-surface/80 p-8 md:p-10">
          <ul className="space-y-5">
            {OUTCOMES.map((outcome, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
                <span className="text-text-primary">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── GOVERNANCE & SAFE ADOPTION ── */}
      <section className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
            <span className="h-px w-8 bg-iris/50" />
            Governance &amp; safe adoption
          </div>
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
            Controlled AI adoption for enterprise teams.
          </h2>
          <p className="text-text-muted">
            Enterprise AI deployment requires governance frameworks, not just capability building.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {GOVERNANCE.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-line bg-surface/80 p-7 space-y-3"
            >
              <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DELIVERY FORMATS ── */}
      <section className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
            <span className="h-px w-8 bg-neon/40" />
            Delivery
          </div>
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
            Embedded where your teams operate.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {DELIVERY.map((d) => (
            <div key={d.format} className="rounded-2xl border border-line bg-surface/80 p-7 space-y-3">
              <p className="text-xs uppercase tracking-[0.5em] text-neon">{d.format}</p>
              <p className="text-sm text-text-muted leading-relaxed">{d.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STUDIO-LINKED PROGRAMS ── */}
      <section className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
            <span className="h-px w-8 bg-iris/50" />
            Studio programs
          </div>
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
            Enablement built into every studio.
          </h2>
          <p className="text-text-muted">
            Each HashAI Studio ships with a corresponding enablement program — turning software
            deployment into organizational adoption.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {STUDIO_PROGRAMS.map((sp) => (
            <div
              key={sp.studio}
              className="group rounded-2xl border border-line bg-surface/80 p-7 space-y-4 transition hover:border-iris/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.5em] text-iris">{sp.studio}</span>
                <span className="text-[0.65rem] uppercase tracking-widest text-text-muted">
                  {sp.industry}
                </span>
              </div>
              <h3 className="text-base font-semibold text-text-primary">{sp.program}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{sp.description}</p>
              <Link
                href={sp.href as Route}
                className="block text-xs uppercase tracking-widest text-text-muted transition hover:text-neon"
              >
                View Studio →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI READINESS ASSESSMENT ── */}
      <section id="assessment" className="rounded-2xl border border-line bg-surface/80 p-10 md:p-14 space-y-6">
        <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">
          <span className="h-px w-8 bg-neon/40" />
          AI Readiness Assessment
        </div>
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
            Evaluate operational AI readiness across your organization.
          </h2>
          <p className="text-text-muted">
            A consultation-led operational audit that maps AI readiness across your teams, workflows,
            and infrastructure — and identifies where transformation programs will deliver the
            highest return.
          </p>
        </div>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-neon px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-base transition hover:bg-white"
        >
          Book Your Assessment
        </a>
      </section>

      {/* ── CONSULTATION CTA ── */}
      <section className="rounded-2xl border border-neon/20 bg-neon/5 p-10 md:p-14 space-y-6 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.6em] text-text-muted">Get started</p>
        <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
          Ready to operationalize AI across your organization?
        </h2>
        <p className="text-text-muted max-w-xl mx-auto">
          Book a consultation with the EnableAI team. We&apos;ll assess your current state and design
          a transformation program tailored to your teams and workflows.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-neon px-8 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-base transition hover:bg-white"
        >
          Book a Consultation
        </a>
      </section>

    </div>
  );
}
