"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect admin to admin panel, others to dashboard
    if (data.user?.email === ADMIN_EMAIL) {
      router.push("/hungerai/admin");
    } else {
      router.push("/hungerai/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--hai-bg-secondary)]">
      <div className="w-full max-w-[400px]">
        {/* Logo & Brand */}
        <div className="text-center mb-10">
          <img
            src="/branding/hungerai-logo.png"
            alt="HungerAI"
            style={{ height: 48, width: "auto", margin: "0 auto 24px" }}
            draggable={false}
          />
          <p className="text-[var(--hai-text-muted)] mt-2 text-sm">
            Sign in to manage your restaurants
          </p>
        </div>

        {/* Login Card */}
        <div className="hai-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--hai-accent-red-light)] border border-[rgba(239,68,68,0.2)]">
                <svg className="w-5 h-5 text-[var(--hai-accent-red)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-[var(--hai-accent-red)]">{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="hai-label"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--hai-text-muted)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  className="hai-input pl-12"
                  placeholder="you@restaurant.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="hai-label"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--hai-text-muted)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  className="hai-input pl-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="hai-btn hai-btn-primary w-full py-4 text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[var(--hai-text-muted)] text-sm mt-8">
          Need help?{" "}
          <a
            href="mailto:support@hashaistudios.com"
            className="text-[var(--hai-accent-primary)] hover:underline font-medium"
          >
            Contact support
          </a>
        </p>
        
        {/* Powered by */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[var(--hai-text-muted)]">
          <span>Powered by</span>
          <span className="font-semibold text-[var(--hai-text-secondary)]">HashAI Studios</span>
        </div>
      </div>
    </div>
  );
}
