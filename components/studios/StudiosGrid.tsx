import Link from "next/link";
import { Studio } from "@/data/studios";
import { Badge } from "../ui/Badge";

const statusCopy: Record<Studio["status"], string> = {
  live: "Live",
  "in-progress": "In Progress",
  "coming-soon": "Coming Soon"
};

const statusDot: Record<Studio["status"], string> = {
  live: "bg-neon",
  "in-progress": "bg-iris",
  "coming-soon": "bg-text-muted"
};

export function StudiosGrid({ studios }: { studios: Studio[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {studios.map((studio) => (
        <Link
          key={studio.slug}
          href={`/studios/${studio.slug}`}
          className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-base-muted/70 p-6 transition hover:border-neon/40"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,249,255,0.12),_transparent_70%)] opacity-0 transition group-hover:opacity-100" />
          <div className="relative flex items-center justify-between">
            <Badge>{statusCopy[studio.status]}</Badge>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-text-muted">
              <span className={`h-2 w-2 rounded-full ${statusDot[studio.status]}`} />
              {studio.industry}
            </div>
          </div>
          <h3 className="relative mt-6 text-2xl font-semibold text-text-primary">{studio.name}</h3>
          <p className="relative mt-3 text-sm text-text-muted">{studio.shortDescription}</p>
          <div className="relative mt-8 flex items-center justify-between text-sm text-text-muted">
            <p>View detail</p>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition group-hover:border-neon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 7H17V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
