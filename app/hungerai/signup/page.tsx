"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SignupPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxPercent, setTaxPercent] = useState("");

  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  // Auto-derive the slug from the restaurant name until the user edits it directly.
  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(restaurantName));
    }
  }, [restaurantName, slugTouched]);

  // Debounced slug-availability check.
  useEffect(() => {
    if (!slug) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/hungerai/signup/check-slug?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.error) setSlugStatus("invalid");
        else setSlugStatus(data.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (slugStatus === "taken" || slugStatus === "invalid") {
      setError("Please choose a different link for your restaurant");
      return;
    }

    setLoading(true);
    const supabase = createBrowserSupabaseClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message || "Could not create account");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/hungerai/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurant_name: restaurantName,
        slug,
        whatsapp_number: whatsappNumber,
        access_token: signUpData.session?.access_token,
        user_id: signUpData.session ? undefined : signUpData.user.id,
        tax_enabled: taxEnabled,
        tax_percent: taxEnabled ? Number(taxPercent) || 0 : 0,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error || "Could not set up your restaurant");
      setLoading(false);
      return;
    }

    const { emailConfirmed } = await response.json();
    if (emailConfirmed) {
      router.push("/hungerai/dashboard");
    } else {
      setPendingConfirmation(true);
      setLoading(false);
    }
  };

  if (pendingConfirmation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[var(--hai-bg-secondary)]">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="font-display text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-[var(--hai-text-muted)] max-w-sm">
          We&apos;ve sent a confirmation link to <strong>{email}</strong>. Confirm your email,
          then sign in to reach your dashboard.
        </p>
        <Link href="/hungerai/login" className="hai-btn hai-btn-primary mt-8">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[var(--hai-bg-secondary)]">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/hungerai-logo.png"
            alt="HungerAI"
            style={{ height: 44, width: "auto", margin: "0 auto 20px" }}
            draggable={false}
          />
          <h1 className="font-display text-2xl font-bold mb-1">Create your restaurant</h1>
          <p className="text-[var(--hai-text-muted)] text-sm">
            Start on a free trial — no card required.
          </p>
        </div>

        <div className="hai-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="hai-closed-banner text-sm">⚠️ {error}</div>
            )}

            <div>
              <label className="hai-label">Restaurant Name</label>
              <input
                type="text"
                required
                className="hai-input"
                placeholder="Burger Point"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
              />
            </div>

            <div>
              <label className="hai-label">Your Menu Link</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--hai-text-muted)] whitespace-nowrap">hashaistudios.com/hungerai/</span>
                <input
                  type="text"
                  required
                  className="hai-input"
                  placeholder="burger-point"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              {slugStatus === "checking" && (
                <p className="text-xs text-[var(--hai-text-muted)] mt-1.5">Checking availability…</p>
              )}
              {slugStatus === "available" && (
                <p className="text-xs text-[var(--hai-accent-green)] mt-1.5">✓ Available</p>
              )}
              {slugStatus === "taken" && (
                <p className="text-xs text-[var(--hai-accent-red)] mt-1.5">Already taken — try another</p>
              )}
              {slugStatus === "invalid" && (
                <p className="text-xs text-[var(--hai-accent-red)] mt-1.5">Lowercase letters, numbers, and hyphens only</p>
              )}
            </div>

            <div>
              <label className="hai-label">WhatsApp Number</label>
              <input
                type="tel"
                required
                className="hai-input"
                placeholder="0300 1234567"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
              <p className="text-xs text-[var(--hai-text-muted)] mt-1.5">Orders will be sent to this number.</p>
            </div>

            <div className="hai-card p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-[var(--hai-text-primary)]">
                  Charge tax on orders?
                </span>
                <input
                  type="checkbox"
                  checked={taxEnabled}
                  onChange={(e) => setTaxEnabled(e.target.checked)}
                  className="w-5 h-5 accent-[var(--hai-accent-primary)]"
                />
              </label>
              {taxEnabled ? (
                <div className="mt-3">
                  <label className="hai-label">Tax Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="0.5"
                    className="hai-input"
                    placeholder="e.g. 16"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                  />
                  <p className="text-xs text-[var(--hai-text-muted)] mt-1.5">
                    Whatever rate applies to you — 16%, 8%, or any percentage. Applied on top of
                    every order&apos;s subtotal.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[var(--hai-text-muted)] mt-1.5">
                  No tax will be added to orders — you can turn this on anytime.
                </p>
              )}
            </div>

            <div>
              <label className="hai-label">Email address</label>
              <input
                type="email"
                required
                className="hai-input"
                placeholder="you@restaurant.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="hai-label">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="hai-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="hai-btn hai-btn-primary w-full py-4 text-base"
              disabled={loading || slugStatus === "taken" || slugStatus === "invalid"}
            >
              {loading ? "Creating your restaurant…" : "Create Restaurant"}
            </button>
          </form>
        </div>

        <p className="text-center text-[var(--hai-text-muted)] text-sm mt-6">
          Already have an account?{" "}
          <Link href="/hungerai/login" className="text-[var(--hai-accent-primary)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
