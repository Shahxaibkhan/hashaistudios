import Link from "next/link";
import { MainNav } from "../navigation/MainNav";
import { BrandLogo } from "../branding/BrandLogo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl">
      <div className="container">
        <div className="mt-6 flex items-center justify-between rounded-full border border-white/5 bg-base-muted/80 px-6 py-3 shadow-glow">
          <Link href="/" className="flex items-center gap-4">
            <span className="rounded-full bg-neon/20 px-6 py-2 text-sm font-bold uppercase tracking-[0.4em] text-neon">
              #AI
            </span>
            <BrandLogo />
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
