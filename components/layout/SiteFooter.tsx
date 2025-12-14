import Link from "next/link";

const footerNav = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "X", href: "https://twitter.com" },
  { label: "Email", href: "mailto:hello@hashaistudios.com" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-base-muted/80">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-text-muted">HashAI Studios</p>
          <p className="max-w-md text-sm text-text-muted">
            Studio-based AI partners delivering autonomous systems for healthcare, sports, hospitality, and real estate.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.4em] text-text-muted">
          {footerNav.map((nav) => (
            <a
              key={nav.label}
              href={nav.href}
              className="transition hover:text-neon"
              target="_blank"
              rel="noreferrer"
            >
              {nav.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
