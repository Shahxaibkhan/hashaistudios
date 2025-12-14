"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.4em] text-text-muted">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative pb-1 transition hover:text-text-primary",
              isActive && "text-text-primary"
            )}
          >
            {link.label}
            <span
              className={cn(
                "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-neon to-transparent transition",
                isActive && "scale-x-100"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
