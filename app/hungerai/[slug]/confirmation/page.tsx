"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import type { Restaurant } from "@/types/hungerai";

interface ConfirmationPageProps {
  params: Promise<{ slug: string }>;
}

function ConfirmationContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) {
        setRestaurant(data as Restaurant);
      }
    };
    fetchRestaurant();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Animated Checkmark */}
      <div className="hai-checkmark mb-8">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle className="hai-checkmark-circle" cx="60" cy="60" r="56" />
          <path
            className="hai-checkmark-check"
            d="M38 62 L52 76 L82 46"
            fill="none"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="font-display text-3xl font-bold text-[var(--hai-text-primary)] mb-4">
        Order Sent! 🎉
      </h1>

      {/* Subtext */}
      <p className="text-[var(--hai-text-secondary)] max-w-sm mb-8">
        Your order{orderNumber && <span className="font-semibold"> #{orderNumber}</span>} has been
        sent to{" "}
        <span className="text-[var(--hai-text-primary)] font-semibold">
          {restaurant?.name || "the restaurant"}
        </span>{" "}
        on WhatsApp. They will confirm shortly.
      </p>

      {/* Order Number Card */}
      {orderNumber && (
        <div className="hai-card p-6 mb-8 w-full max-w-sm">
          <p className="text-sm text-[var(--hai-text-muted)] mb-1">Order Number</p>
          <p className="text-4xl font-display font-bold text-[var(--hai-accent-green)]">
            #{orderNumber}
          </p>
        </div>
      )}

      {/* Info Card */}
      <div className="hai-card p-4 mb-8 w-full max-w-sm text-left">
        <h3 className="font-semibold text-[var(--hai-text-primary)] mb-3">
          What happens next?
        </h3>
        <ul className="space-y-2 text-sm text-[var(--hai-text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-[var(--hai-accent-green)]">✓</span>
            The restaurant received your order via WhatsApp
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--hai-accent-green)]">✓</span>
            They will confirm and share delivery time
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--hai-accent-green)]">✓</span>
            Track updates directly in your WhatsApp chat
          </li>
        </ul>
      </div>

      {/* Order More Button */}
      <Link
        href={`/hungerai/${slug}`}
        className="hai-btn hai-btn-primary px-8 py-4 text-lg"
      >
        ← Order More
      </Link>
    </div>
  );
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="hai-skeleton w-32 h-8" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="hai-skeleton w-32 h-8" />
      </div>
    }>
      <ConfirmationContent slug={slug} />
    </Suspense>
  );
}
