import Link from "next/link";

export default function HungerAINotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-[var(--hai-bg-elevated)] flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-[var(--hai-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="font-display text-3xl font-bold text-[var(--hai-text-primary)] mb-4">
        Restaurant Not Found
      </h1>

      {/* Subtext */}
      <p className="text-[var(--hai-text-secondary)] max-w-sm mb-8">
        The restaurant you&apos;re looking for doesn&apos;t exist or may have been removed.
        Check the URL and try again.
      </p>

      {/* Back Button */}
      <Link
        href="/"
        className="hai-btn hai-btn-secondary px-8 py-4"
      >
        ← Back to Home
      </Link>

      {/* Branding */}
      <div className="mt-12 text-[var(--hai-text-muted)] text-sm">
        Powered by <span className="text-[var(--hai-accent-green)] font-semibold">HungerAI</span>
      </div>
    </div>
  );
}
