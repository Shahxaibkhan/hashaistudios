import Link from "next/link";
import { MainNav } from "../navigation/MainNav";
import { BrandLogo } from "../branding/BrandLogo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl">
      <div className="container">
        <div className="mt-6 flex flex-col gap-4 rounded-[28px] border border-white/5 bg-base-muted/80 px-5 py-3 shadow-glow sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-6">
          <Link
            href="/"
            className="flex w-full flex-wrap items-center gap-2 text-left sm:w-auto sm:flex-nowrap sm:gap-4"
          >
            <span className="rounded-full bg-neon/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-neon sm:px-6 sm:py-2 sm:text-sm sm:tracking-[0.4em]">
              #AI
            </span>
            <BrandLogo className="min-w-0 max-w-[220px]" />
          </Link>
          <div className="hidden items-center gap-6 lg:flex">
            <MainNav />
            <Link
              href="/studios"
              className="rounded-full bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-text-primary transition hover:bg-neon hover:text-base"
            >
              Studios
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
