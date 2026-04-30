"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import type { Restaurant } from "@/types/hungerai";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserSupabaseClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/hungerai/login");
        return;
      }

      setUser({ email: session.user.email || "" });

      const { data: restaurantData, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_email", session.user.email)
        .single();

      if (error || !restaurantData) {
        setLoading(false);
        return;
      }

      setRestaurant(restaurantData as Restaurant);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/hungerai/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--hai-bg-secondary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] animate-pulse" />
          <div className="hai-skeleton w-32 h-4 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--hai-bg-secondary)]">
        <div className="w-20 h-20 rounded-2xl bg-[var(--hai-bg-card)] shadow-md flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-[var(--hai-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold mb-3">No Restaurant Found</h1>
        <p className="text-[var(--hai-text-muted)] mb-8 max-w-sm">
          Your email ({user?.email}) is not associated with any restaurant. Contact support to get started.
        </p>
        <button onClick={handleSignOut} className="hai-btn hai-btn-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    );
  }

  const navItems = [
    { href: "/hungerai/dashboard" as const, label: "Dashboard", icon: DashboardIcon },
    { href: "/hungerai/dashboard/orders" as const, label: "Orders", icon: OrdersIcon },
    { href: "/hungerai/dashboard/menu" as const, label: "Menu", icon: MenuIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--hai-bg-secondary)]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--hai-bg-card)] border-b border-[var(--hai-border)] shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-lg font-bold tracking-tight text-[var(--hai-text-primary)]">
                  {restaurant.name}
                </h1>
                <p className="text-xs text-[var(--hai-text-muted)]">Restaurant Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`hai-badge ${restaurant.is_open ? 'hai-badge-green' : 'hai-badge-red'}`}>
                <span className={`w-2 h-2 rounded-full ${restaurant.is_open ? 'bg-[var(--hai-accent-green)]' : 'bg-[var(--hai-accent-red)]'}`} />
                {restaurant.is_open ? "Open" : "Closed"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 lg:px-6 pb-3">
            <div className="hai-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href as "/hungerai/dashboard" | "/hungerai/dashboard/orders" | "/hungerai/dashboard/menu"}
                    className={`hai-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--hai-bg-card)] border-t border-[var(--hai-border)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-[var(--hai-text-muted)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-[var(--hai-text-muted)] hover:text-[var(--hai-accent-red)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
