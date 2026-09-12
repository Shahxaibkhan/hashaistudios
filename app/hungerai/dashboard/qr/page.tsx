"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/hungerai/supabase";
import type { Restaurant } from "@/types/hungerai";
import QrPoster from "@/components/hungerai/dashboard/QrPoster";

const SITE_ORIGIN = "https://hashaistudios.com";

export default function QrCodesPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableCount, setTableCount] = useState(10);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_email", session.user.email)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      setRestaurant(data as Restaurant | null);
      setLoading(false);
    };
    fetchRestaurant();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="hai-skeleton h-8 w-48 rounded-lg" />
        <div className="hai-skeleton h-64 rounded-xl" />
      </div>
    );
  }

  if (!restaurant) {
    return <p className="text-[var(--hai-text-muted)]">No restaurant found.</p>;
  }

  const curbsideUrl = `${SITE_ORIGIN}/hungerai/${restaurant.slug}?type=curbside`;
  const tableNumbers = Array.from({ length: Math.max(1, tableCount) }, (_, i) => String(i + 1));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-xl font-bold mb-1">QR Codes</h1>
        <p className="text-[var(--hai-text-muted)] text-sm">
          Print these and put them up — a customer who scans skips straight to the right order flow,
          no typing required and no order-type mix-ups.
        </p>
      </div>

      {/* Curbside */}
      <section>
        <h2 className="font-display text-lg font-bold mb-1">Curbside Pickup</h2>
        <p className="text-sm text-[var(--hai-text-muted)] mb-4">
          Post this outside your shop entrance or in your parking area.
        </p>
        <div className="max-w-xs">
          <QrPoster
            url={curbsideUrl}
            restaurantName={restaurant.name}
            headline="Scan to Order"
            subline="Curbside — we'll bring it to your car"
            filename={`${restaurant.slug}-curbside-qr.png`}
            large
          />
        </div>
      </section>

      {/* Dine-in tables */}
      <section>
        <h2 className="font-display text-lg font-bold mb-1">Dine-In Tables</h2>
        <p className="text-sm text-[var(--hai-text-muted)] mb-4">
          One QR per table — customers order straight from their seat, no waiter needed.
        </p>

        <div className="no-print flex flex-wrap items-center gap-3 mb-6">
          <label htmlFor="table-count" className="text-sm font-medium text-[var(--hai-text-secondary)]">
            Number of tables
          </label>
          <input
            id="table-count"
            type="number"
            min={1}
            max={100}
            value={tableCount}
            onChange={(e) => setTableCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
            className="hai-input w-24"
          />
          <button
            type="button"
            onClick={() => window.print()}
            className="hai-btn hai-btn-primary sm:ml-auto"
          >
            🖨️ Print All Tables
          </button>
        </div>

        <div className="hai-qr-grid">
          {tableNumbers.map((n) => (
            <QrPoster
              key={n}
              url={`${SITE_ORIGIN}/hungerai/${restaurant.slug}?type=dine_in&table=${n}`}
              restaurantName={restaurant.name}
              headline="Scan to Order"
              subline={`Table ${n}`}
              filename={`${restaurant.slug}-table-${n}-qr.png`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
